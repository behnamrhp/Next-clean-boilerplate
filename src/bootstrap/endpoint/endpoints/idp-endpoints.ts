import serverConfigs from "@/bootstrap/configs/server-configs";
import Endpoint from "../endpoint";

export default class IdpEndpoint extends Endpoint {
  /* ------------------------------ Dependencies ------------------------------ */
  private tokenEndpoint: string;

  private profileEndpoint: string;

  private signInCallbackUrl: string;

  /* --------------------------------- Getters -------------------------------- */
  get token() {
    return this.buildEndpoint(this.tokenEndpoint);
  }

  get profile() {
    return this.buildEndpoint(this.profileEndpoint);
  }

  /* ------------------------------- Constructor ------------------------------ */
  constructor() {
    super({
      apiVersion: "api",
      baseURL: serverConfigs.env.idp.url,
    });
    this.tokenEndpoint = "login/oauth/access_token";
    this.profileEndpoint = "userinfo";
    this.signInCallbackUrl = `login/oauth/authorize`;
  }

  /* ----------------------------- Implementations ---------------------------- */
  signIncallback(callbackUrl: string) {
    return Endpoint.sanitizeURL(
      `${this.baseURL}/${
        this.signInCallbackUrl
      }?response_type=code&client_id=${serverConfigs.env.idp.clientId}&scope=profile&redirect_uri=${callbackUrl}`,
    );
  }
  /* -------------------------------------------------------------------------- */
}
