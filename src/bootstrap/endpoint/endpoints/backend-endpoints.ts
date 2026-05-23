import serverConfigs from "@/bootstrap/configs/server-configs";
import Endpoint from "@/bootstrap/endpoint/endpoint";
import IBaseHttpResponse from "@/feature/common/data/http/i-base-http-response";
import ArgumentsFailure from "@/feature/common/failures/dev/arguments.failure";

type BackendResponseWithError = {
  error: string;
};

type BackendResponseSuccess<DATA> = DATA;

export type BackendResponse<DATA> =
  | BackendResponseWithError
  | BackendResponseSuccess<DATA>;

export default class BackendEndpoint extends Endpoint<unknown> {
  protected baseURL = serverConfigs.env.backendApi.url;

  protected apiVersion = "api/v1";

  protected interceptors = undefined;

  private usersEndpoint = "users";

  protected toHttpDataResponse<DATA>(
    response: unknown,
  ): IBaseHttpResponse<DATA> {
    if (response === undefined || response === null) {
      return {
        data: true as DATA,
        success: true,
        status: "200",
      };
    }

    if (
      typeof response === "object" &&
      "error" in response &&
      typeof response.error === "string"
    ) {
      throw new ArgumentsFailure(response.error);
    }

    return {
      data: response as DATA,
      success: true,
      status: "200",
    };
  }

  get users() {
    return this.buildEndpoint(this.usersEndpoint);
  }
}
