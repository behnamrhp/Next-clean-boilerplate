import {
  HTTPResponse,
  HttpRequestConfig,
  HttpRequestInterceptor,
  HttpResponseInterceptor,
  IHttpBoundary,
} from "@/bootstrap/boundaries/http-boundary/http-boundary.interface";
import commonConfigs from "@/bootstrap/configs/common-configs";
import ApiTask from "@/feature/common/data/api-task";
import BaseFailure from "@/feature/common/failures/base.failure";
import ClientResponseFailure from "@/feature/common/failures/client-response.failure";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import NetworkFailure from "@/feature/common/failures/network.failure";
import ServerResponseFailure from "@/feature/common/failures/server-response.failure";
import { tryCatch } from "fp-ts/lib/TaskEither";

type HttpFailureMetadata = {
  status: number;
  restInfo: unknown;
};

type HttpStatusFailureClass = new (
  metaData?: HttpFailureMetadata,
) => BaseFailure<HttpFailureMetadata>;

export type { HTTPResponse };

export default class HttpBoundary implements IHttpBoundary {
  public interceptors?: {
    request?: HttpRequestInterceptor;
    response?: HttpResponseInterceptor;
  };

  static httpStatusToFailure: Record<number, HttpStatusFailureClass> = {
    4: ClientResponseFailure,
    5: ServerResponseFailure,
    3: ServerResponseFailure,
  };

  constructor({
    interceptors,
  }: {
    interceptors?: {
      request?: HttpRequestInterceptor;
      response?: HttpResponseInterceptor;
    };
  }) {
    this.interceptors = interceptors;
  }

  request(url: string, configs: HttpRequestConfig = {}): ApiTask<HTTPResponse> {
    return tryCatch(
      async () => {
        const finalConfigs = await this.requestWithInterceptors(configs);

        const timeout = finalConfigs.timeout ?? commonConfigs.httpTimeout;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const signal = finalConfigs.signal
          ? (() => {
              const combinedController = new AbortController();
              finalConfigs.signal?.addEventListener("abort", () =>
                combinedController.abort(),
              );
              controller.signal.addEventListener("abort", () =>
                combinedController.abort(),
              );
              return combinedController.signal;
            })()
          : controller.signal;

        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { timeout: _, ...fetchConfigs } = finalConfigs;
          let response = (await fetch(url, {
            ...fetchConfigs,
            signal,
          })) as HTTPResponse;
          clearTimeout(timeoutId);

          if (this.interceptors?.response?.onSuccess && response.ok) {
            response = await this.interceptors.response.onSuccess(
              response,
              this,
            );
          }

          if (this.interceptors?.response?.onReject && !response.ok) {
            response = await this.interceptors.response.onReject(
              response,
              this,
            );
          }

          if (response.ok) return response;
          const json = await response.json();
          response.data = json;
          if (response.status === 404) {
            throw new ServerResponseFailure({
              status: response.status,
              restInfo: {
                operation: "http-boundary-request",
                reason: "backend endpoint not found",
                endpoint: url,
                ...response,
                data: json,
              },
            });
          }

          const failureStatusCategory = Number(
            response?.status?.toString()?.at(0) ?? 0,
          );
          const Failure =
            HttpBoundary.httpStatusToFailure[failureStatusCategory];

          throw Failure
            ? new Failure({
                status: response.status,
                restInfo: {
                  ...response,
                  data: json,
                },
              })
            : response;
        } catch (error) {
          clearTimeout(timeoutId);
          if (error instanceof Error && error.name === "AbortError") {
            throw new NetworkFailure({
              error: `Request timeout after ${timeout}ms`,
              operation: "http-boundary-request",
              request: JSON.stringify({ url, ...configs }),
            });
          }
          throw error;
        }
      },
      (l) =>
        failureOr(
          l,
          new NetworkFailure({
            error: JSON.stringify(l instanceof Error ? l.message : l),
            operation: "http-boundary-request",
            request: JSON.stringify({ url, ...configs }),
          }),
        ),
    );
  }

  head(url: string, config?: HttpRequestConfig): ApiTask<HTTPResponse> {
    return this.request(url, { ...config, method: "HEAD" });
  }

  get(url: string, config?: HttpRequestConfig): ApiTask<HTTPResponse> {
    return this.request(url, { ...config, method: "GET" });
  }

  post(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): ApiTask<HTTPResponse> {
    return this.request(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): ApiTask<HTTPResponse> {
    return this.request(url, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(url: string, config?: HttpRequestConfig): ApiTask<Response> {
    return this.request(url, { ...config, method: "DELETE" });
  }

  private requestWithInterceptors(configs: HttpRequestConfig) {
    if (!this.interceptors?.request) return configs;
    return this.interceptors.request(configs, this);
  }
}
