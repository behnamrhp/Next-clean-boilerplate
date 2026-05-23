import HttpBoundary from "@/bootstrap/boundaries/http-boundary/http-boundary";
import {
  HttpRequestInterceptor,
  HttpResponseInterceptor,
  IHttpBoundary,
} from "@/bootstrap/boundaries/http-boundary/http-boundary.interface";
import ApiTask from "@/feature/common/data/api-task";
import IBaseHttpResponse from "@/feature/common/data/http/i-base-http-response";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import ResponseStructureFailure from "@/feature/common/failures/response-structure.failure";
import { tryCatch } from "fp-ts/lib/TaskEither";

/**
 * Base class for defining API endpoints.
 *
 * Each endpoint child class owns:
 * - URL construction for its API
 * - Response structure mapping to a unified HTTP response shape
 * - Optional request/response interceptors scoped to that API
 */
export default abstract class Endpoint<RESPONSE_STRUCT> {
  protected abstract baseURL: string;

  protected abstract apiVersion: string;

  /**
   * Maps the raw API response from this endpoint to the unified HTTP response.
   * Throwing here converts to ResponseStructureFailure via toHttpResponse.
   */
  protected abstract toHttpDataResponse<DATA>(
    response: RESPONSE_STRUCT,
  ): IBaseHttpResponse<DATA>;

  protected abstract interceptors?: {
    request?: HttpRequestInterceptor;
    response?: HttpResponseInterceptor;
  };

  get HttpBoundary(): IHttpBoundary {
    return new HttpBoundary({ interceptors: this.interceptors });
  }

  toHttpResponse<DATA>(
    response: RESPONSE_STRUCT,
  ): ApiTask<IBaseHttpResponse<DATA>> {
    return tryCatch(
      async () => this.toHttpDataResponse<DATA>(response),
      (l) =>
        failureOr(
          l,
          new ResponseStructureFailure({
            message: "API response structure does not match the expected shape",
          }),
        ),
    );
  }

  static compose(uris: string[]) {
    return Endpoint.sanitizeURL(uris.join("/"));
  }

  protected buildEndpoint(endpoint: string) {
    return Endpoint.sanitizeURL(
      `${this.baseURL}/${this.apiVersion}/${endpoint}`,
    );
  }

  static sanitizeURL(url: string) {
    return url.replaceAll(/(?<!:)\/\//g, "/");
  }
}
