import serverConfigs from "@/bootstrap/configs/server-configs";
import Endpoint from "../endpoint";

export default class BackendEndpoint extends Endpoint {
  /* ------------------------------ Dependencies ------------------------------ */
  private credentialsEndpoint: string;

  private usersEndpoint: string;

  private teamsEndpoint: string;

  private membersEndpoint: string;

  private generatePassUsernameEndpoint: string;

  /* --------------------------------- Getters -------------------------------- */
  get credentials() {
    return this.buildEndpoint(this.credentialsEndpoint);
  }

  get users() {
    return this.buildEndpoint(this.usersEndpoint);
  }

  get teams() {
    return this.buildEndpoint(this.teamsEndpoint);
  }

  get members() {
    return this.buildEndpoint(this.membersEndpoint);
  }

  get generatePassUsername() {
    return this.buildEndpoint(
      `${this.credentialsEndpoint}/${this.generatePassUsernameEndpoint}`,
    );
  }

  /* ------------------------------- Constructor ------------------------------ */
  constructor() {
    super({
      apiVersion: "api/v1",
      baseURL: serverConfigs.env.backendApi.url,
    });
    this.credentialsEndpoint = "credentials";
    this.usersEndpoint = "users";
    this.generatePassUsernameEndpoint = "username";
    this.teamsEndpoint = "teams";
    this.membersEndpoint = "members";
  }

  /* -------------------------------------------------------------------------- */
}
