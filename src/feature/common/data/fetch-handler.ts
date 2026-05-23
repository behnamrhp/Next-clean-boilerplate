import Endpoint from "@/bootstrap/endpoint/endpoint";
import ApiTask from "@/feature/common/data/api-task";
import BaseHttpResponse from "@/feature/common/data/http/base-http-response";
import IBaseHttpResponse from "@/feature/common/data/http/i-base-http-response";
import taskMapJsonToResponse from "@/feature/common/data/task-map-json-to-response";
import { failureOrCurry } from "@/feature/common/failures/failure-helpers";
import NetworkFailure from "@/feature/common/failures/network.failure";
import { diResolve } from "@/feature/common/features.di";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import AuthRepo, {
  authRepoKey,
} from "@/feature/generic/auth/domain/i-repo/auth.repository";
import { pipe } from "fp-ts/lib/function";
import { chain, mapLeft } from "fp-ts/lib/TaskEither";

export type FetchOptions<
  BODY extends
    | Record<string, unknown>
    | string
    | string[]
    | undefined = undefined,
> = {
  endpoint: string;
  method: "POST" | "GET" | "PUT" | "DELETE";
  cache?: RequestCache;
  headers?: HeadersInit;
  body?: BODY;
};

export default class FetchHandler {
  private authRepo: AuthRepo;

  private static mergeHeaders(
    base: Record<string, string>,
    extra?: HeadersInit,
  ): Record<string, string> {
    if (!extra) return base;

    if (extra instanceof Headers) {
      const merged = { ...base };
      extra.forEach((value, key) => {
        merged[key] = value;
      });
      return merged;
    }

    if (Array.isArray(extra)) {
      return extra.reduce(
        (merged, [key, value]) => ({ ...merged, [key]: value }),
        base,
      );
    }

    return { ...base, ...extra };
  }

  constructor() {
    this.authRepo = diResolve(authModuleKey, authRepoKey);
  }

  fetchWithAuth<
    DATA = unknown,
    RESPONSE_STRUCT = unknown,
    BODY extends
      | Record<string, unknown>
      | string
      | string[]
      | undefined = undefined,
  >(
    endpointInstance: Endpoint<RESPONSE_STRUCT>,
    options: FetchOptions<BODY>,
  ): ApiTask<DATA> {
    return pipe(
      this.authRepo.getCachedToken(),
      chain((token) =>
        pipe(
          endpointInstance.HttpBoundary.request(options.endpoint, {
            method: options.method,
            body: options.body ? JSON.stringify(options.body) : undefined,
            cache: options.cache,
            headers: FetchHandler.mergeHeaders(
              { Authorization: token.getTokenForHeader() },
              options.headers,
            ),
          }),
          taskMapJsonToResponse<DATA, RESPONSE_STRUCT>(endpointInstance),
          chain(BaseHttpResponse.getHTTPResponseData),
        ),
      ),
      mapLeft((f) => f.toPlainObject()),
    );
  }

  fetchWithAuthResponse<
    DATA = unknown,
    RESPONSE_STRUCT = unknown,
    BODY extends Record<string, unknown> | undefined = undefined,
  >(
    endpointInstance: Endpoint<RESPONSE_STRUCT>,
    options: FetchOptions<BODY>,
  ): ApiTask<IBaseHttpResponse<DATA>> {
    return pipe(
      this.authRepo.getCachedToken(),
      chain((token) =>
        pipe(
          endpointInstance.HttpBoundary.request(options.endpoint, {
            method: options.method,
            body: options.body ? JSON.stringify(options.body) : undefined,
            headers: {
              Authorization: token.getTokenForHeader(),
            },
          }),
          taskMapJsonToResponse<DATA, RESPONSE_STRUCT>(endpointInstance),
        ),
      ),
      mapLeft((f) => f.toPlainObject()),
    );
  }

  fetchWithoutAuthWithRepsonseStatus<
    RESPONSE_STRUCT = unknown,
    BODY extends Record<string, unknown> | undefined = undefined,
  >(
    endpointInstance: Endpoint<RESPONSE_STRUCT>,
    options: FetchOptions<BODY>,
  ): ApiTask<Response> {
    return pipe(
      endpointInstance.HttpBoundary.request(options.endpoint, {
        method: options.method,
        body: options.body ? JSON.stringify(options.body) : undefined,
      }),
      mapLeft(failureOrCurry(new NetworkFailure())),
    );
  }
}
