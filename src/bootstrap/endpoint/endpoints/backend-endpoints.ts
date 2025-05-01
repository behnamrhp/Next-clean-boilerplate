import serverConfigs from "@/bootstrap/configs/server-configs";
import Endpoint from "../endpoint";

export default class BackendEndpoint extends Endpoint {
  /* ------------------------------ Dependencies ------------------------------ */
  private usersEndpoint: string;

  /* --------------------------------- Getters -------------------------------- */
  get users() {
    return this.buildEndpoint(this.usersEndpoint);
  }

  /* ------------------------------- Constructor ------------------------------ */
  constructor() {
    super({
      apiVersion: "api/v1",
      baseURL: serverConfigs.env.backendApi.url,
    });
    this.usersEndpoint = "users";
  }

  /* -------------------------------------------------------------------------- */
}
