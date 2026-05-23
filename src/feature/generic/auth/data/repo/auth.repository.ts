import serverConfigs from "@/bootstrap/configs/server-configs";
import EndpointProvider from "@/bootstrap/endpoint/endpoint-provider";
import {
  IdpProfileResponse,
  IdpResponse,
  IdpTokenResponse,
} from "@/bootstrap/endpoint/endpoints/idp-endpoints";
import ApiTask from "@/feature/common/data/api-task";
import BaseHttpResponse from "@/feature/common/data/http/base-http-response";
import taskMapJsonToResponse from "@/feature/common/data/task-map-json-to-response";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import AuthProfile, {
  AuthProfileParams,
} from "@/feature/generic/auth/domain/entity/auth-profile.enity";
import AuthToken from "@/feature/generic/auth/domain/entity/auth-token.entity";
import AuthTokenFailure from "@/feature/generic/auth/domain/failure/auth-token-failure";
import AuthProfileFailure from "@/feature/generic/auth/domain/failure/auth-profile-failure";
import AuthRepo from "@/feature/generic/auth/domain/i-repo/auth.repository";
import { pipe } from "fp-ts/lib/function";
import { chain, map, tryCatch } from "fp-ts/lib/TaskEither";
import { cookies } from "next/headers";
import AuthCachedTokenFailure from "@/feature/generic/auth/domain/failure/auth-cached-token-failure";
import AuthCachedProfileFailure from "@/feature/generic/auth/domain/failure/auth-cached-profile-failure";
import { ApiRole } from "@/feature/core/user/data/repository/user.repository";
import UserMapper from "@/feature/core/user/data/repository/user.mapper";

export default class AuthIDPRepo implements AuthRepo {
  private endpoint = EndpointProvider.idp;

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
      this.requestToken(code),
      chain((tokenResponse) =>
        tryCatch(this.storeTokenToCookie(tokenResponse), (l) =>
          failureOr(l, new AuthTokenFailure({ reason: l })),
        ),
      ),
      map((token) => token),
    );
  }

  fetchProfileByToken(authToken: AuthToken): ApiTask<AuthProfile> {
    return pipe(
      this.requestProfile(authToken),
      chain((profileResponse) => {
        const profile = this.mapToProfileEntity(profileResponse);
        return tryCatch(this.storeProfileToCookie(profile), (l) =>
          failureOr(l, new AuthProfileFailure({ reason: l })),
        );
      }),
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

  private requestToken(code: string): ApiTask<AuthToken> {
    const params = {
      code,
      grant_type: "authorization_code",
      client_id: serverConfigs.env.idp.clientId,
      client_secret: serverConfigs.env.idp.clientSecret,
    };

    return pipe(
      this.endpoint.HttpBoundary.post(this.endpoint.token, params),
      taskMapJsonToResponse<IdpTokenResponse, IdpResponse>(this.endpoint),
      chain(BaseHttpResponse.getHTTPResponseData),
      map(this.mapToTokenEntity),
    );
  }

  private requestProfile(
    authToken: AuthToken,
  ): ApiTask<IdpProfileResponse> {
    return pipe(
      this.endpoint.HttpBoundary.get(this.endpoint.profile, {
        headers: {
          Authorization: `${authToken.tokenType} ${authToken.accessToken}`,
        },
      }),
      taskMapJsonToResponse<IdpProfileResponse, IdpResponse>(this.endpoint),
      chain(BaseHttpResponse.getHTTPResponseData),
    );
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
        (profileResponse?.roles?.at(0) as ApiRole) ?? ApiRole.DESIGNER
      ],
    });
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
