import serverConfigs from "@/bootstrap/configs/server-configs";
import ApiTask from "@/feature/common/data/api-task";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import AuthProfile, {
  AuthProfileParams,
} from "@/feature/generic/auth/domain/entity/auth-profile.enity";
import AuthToken from "@/feature/generic/auth/domain/entity/auth-token.entity";
import AuthTokenFailure from "@/feature/generic/auth/domain/failure/auth-token-failure";
import AuthProfileFailure from "@/feature/generic/auth/domain/failure/auth-profile-failure";
import AuthRepo from "@/feature/generic/auth/domain/i-repo/auth.repository";
import { pipe } from "fp-ts/lib/function";
import { chain, map, mapLeft, tryCatch } from "fp-ts/lib/TaskEither";
import { cookies } from "next/headers";
import AuthCachedTokenFailure from "@/feature/generic/auth/domain/failure/auth-cached-token-failure";
import AuthCachedProfileFailure from "@/feature/generic/auth/domain/failure/auth-cached-profile-failure";
import { ApiRole } from "@/feature/core/user/data/repository/user.repository";
import UserMapper from "@/feature/core/user/data/repository/user.mapper";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import IdpEndpoint from "@/bootstrap/endpoint/endpoints/idp-endpoints";
import { diResolve } from "@/feature/common/features.di";

type IdpTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: "profile";
  token_type: "Bearer";
};

type IdpProfileResponse = {
  name: string;
  picture: string;
  preferred_username: string;
  sub: string;
  roles?: ApiRole[];
};
export default class AuthIDPRepo implements AuthRepo {
  private endpoint;

  constructor() {
    this.endpoint = diResolve<IdpEndpoint>(authModuleKey, IdpEndpoint);
  }

  logout(): ApiTask<true> {
    return pipe(
      tryCatch(
        async () => {
          const cookie = await cookies();
          cookie.delete(serverConfigs.cookies.authToken);
          cookie.delete(serverConfigs.cookies.authProfile);
          return true;
        },
        () => new AuthCachedTokenFailure(),
      ),
    ) as ApiTask<true>;
  }

  exchangeCodeWithToken(code: string): ApiTask<AuthToken> {
    return pipe(
      tryCatch(this.fetchTokenHandler(code), this.failureOrAuthTokenFailure),
      map(this.mapToTokenEntity),
      chain((data) =>
        tryCatch(this.storeTokenToCookie(data), this.failureOrAuthTokenFailure),
      ),
      mapLeft(this.failureOrAuthTokenFailure),
    );
  }

  fetchProfileByToken(authToken: AuthToken): ApiTask<AuthProfile> {
    return pipe(
      tryCatch(
        this.fetchProfileHandler(authToken),
        this.failureOrAuthProfileFailure,
      ),
      map(this.mapToProfileEntity),
      chain((profile) =>
        tryCatch(
          this.storeProfileToCookie(profile),
          this.failureOrAuthProfileFailure,
        ),
      ),
    );
  }

  getCachedProfile(): ApiTask<AuthProfileParams> {
    return pipe(
      tryCatch(async () => {
        const cookieProfile = (await cookies()).get(
          serverConfigs.cookies.authProfile,
        )?.value as undefined | string;

        if (!cookieProfile) throw new Error("Cached profile not exists");

        return new AuthProfile(JSON.parse(cookieProfile)).toPlainObject();
      }, this.failureOrCachedProfileFailure.bind(this)),
    );
  }

  getCachedToken(): ApiTask<AuthToken> {
    return pipe(
      tryCatch(async () => {
        const cookieToken = (await cookies()).get(
          serverConfigs.cookies.authToken,
        )?.value as undefined | string;

        if (!cookieToken) throw new Error("Cached token not exists");

        return new AuthToken(JSON.parse(cookieToken));
      }, this.failureOrCachedTokenFailure.bind(this)),
    );
  }

  private fetchTokenHandler(code: string) {
    return async () => {
      const params = {
        code,
        grant_type: "authorization_code",
        client_id: serverConfigs.env.idp.clientId,
        client_secret: serverConfigs.env.idp.clientSecret,
      };
      const body = JSON.stringify(params);
      const response = await fetch(this.endpoint.token, {
        body,
        method: "POST",
      });
      const data = (await response.json()) as IdpTokenResponse;
      if (!data.access_token) throw new Error("Access token not found");
      return data;
    };
  }

  private fetchProfileHandler(authToken: AuthToken) {
    return async () => {
      const response = await fetch(this.endpoint.profile, {
        headers: {
          Authorization: `${authToken.tokenType} ${authToken.accessToken}`,
        },
      });
      const streamedData = await response.json();
      const data = streamedData as {
        name: string;
        picture: string;
        preferred_username: string;
        sub: string;
        roles: ApiRole[];
      };

      return data;
    };
  }

  private mapToTokenEntity(tokenResponse: IdpTokenResponse) {
    return new AuthToken({
      accessToken: tokenResponse.access_token,
      expiresIn: tokenResponse.expires_in,
      tokenType: tokenResponse.token_type,
    });
  }

  private mapToProfileEntity(profileResponse: IdpProfileResponse) {
    return new AuthProfile({
      avatar: profileResponse.picture,
      id: profileResponse.sub,
      name: profileResponse.name,
      username: profileResponse.preferred_username,
      role: UserMapper.toEntityRole[
        profileResponse?.roles?.at(0) ?? ApiRole.DESIGNER
      ],
    });
  }

  private failureOrAuthTokenFailure(reason: unknown) {
    return failureOr(reason, new AuthTokenFailure({ reason }));
  }

  private failureOrAuthProfileFailure(reason: unknown) {
    return failureOr(reason, new AuthProfileFailure({ reason }));
  }

  private failureOrCachedProfileFailure(reason: unknown) {
    this.deleteProfileCookie();
    return failureOr(reason, new AuthCachedProfileFailure({ reason }));
  }

  private failureOrCachedTokenFailure(reason: unknown) {
    this.deleteTokenCookie();
    return failureOr(reason, new AuthCachedTokenFailure({ reason }));
  }

  private deleteTokenCookie() {
    cookies().then((cookie) => cookie.delete(serverConfigs.cookies.authToken));
  }

  private deleteProfileCookie() {
    cookies().then((cookie) =>
      cookie.delete(serverConfigs.cookies.authProfile),
    );
  }

  private storeTokenToCookie(token: AuthToken) {
    return async () => {
      (await cookies()).set({
        name: serverConfigs.cookies.authToken,
        value: JSON.stringify(token),
        httpOnly: true,
        sameSite: true,
        expires: new Date(Date.now(), token.expiresIn),
      });
      return token;
    };
  }

  private storeProfileToCookie(profile: AuthProfile) {
    return async () => {
      (await cookies()).set({
        name: serverConfigs.cookies.authProfile,
        value: JSON.stringify(profile),
      });

      return profile;
    };
  }
}
