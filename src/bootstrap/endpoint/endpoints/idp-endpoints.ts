import serverConfigs from "@/bootstrap/configs/server-configs";
import Endpoint from "@/bootstrap/endpoint/endpoint";
import IBaseHttpResponse from "@/feature/common/data/http/i-base-http-response";

export type IdpTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: "profile";
  token_type: "Bearer";
};

export type IdpProfileResponse = {
  name: string;
  picture: string;
  preferred_username: string;
  sub: string;
  roles?: string[];
};

export type IdpResponse = IdpTokenResponse | IdpProfileResponse;

export default class IdpEndpoint extends Endpoint<IdpResponse> {
  protected baseURL = serverConfigs.env.idp.url;

  protected apiVersion = "api";

  protected interceptors = undefined;

  private tokenEndpoint = "login/oauth/access_token";

  private profileEndpoint = "userinfo";

  private signInCallbackUrl = "login/oauth/authorize";

  protected toHttpDataResponse<DATA>(
    response: IdpResponse,
  ): IBaseHttpResponse<DATA> {
    if ("access_token" in response || "sub" in response) {
      return {
        data: response as DATA,
        success: true,
        status: "200",
      };
    }

    throw response;
  }

  get token() {
    return this.buildEndpoint(this.tokenEndpoint);
  }

  get profile() {
    return this.buildEndpoint(this.profileEndpoint);
  }

  signIncallback(callbackUrl: string) {
    return Endpoint.sanitizeURL(
      `${this.baseURL}/${
        this.signInCallbackUrl
      }?response_type=code&client_id=${serverConfigs.env.idp.clientId}&scope=profile&redirect_uri=${callbackUrl}`,
    );
  }
}
