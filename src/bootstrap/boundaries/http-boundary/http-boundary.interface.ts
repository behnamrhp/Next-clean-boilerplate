import ApiTask from "@/feature/common/data/api-task";

/**
 * Represents the configuration for a fetch request
 * Extends native RequestInit with additional options
 */
export interface HttpRequestConfig extends RequestInit {
  baseURL?: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
}

export type HTTPResponse = Response & {
  data?: unknown;
};

/**
 * Interface for request and response interceptors
 */
export type HttpResponseInterceptor<T extends Response = Response> = {
  onReject: (error: Response, instance: IHttpBoundary) => T | Promise<T>;
  onSuccess: (response: Response, instance: IHttpBoundary) => T | Promise<T>;
};

export type HttpRequestInterceptor = (
  configs: HttpRequestConfig,
  instance: IHttpBoundary,
) => HttpRequestConfig | Promise<HttpRequestConfig>;

/**
 * Main Http Instance interface
 */
export interface IHttpBoundary {
  interceptors?: {
    request?: HttpRequestInterceptor;
    response?: HttpResponseInterceptor;
  };

  request(url: string, config?: HttpRequestConfig): ApiTask<HTTPResponse>;
  get(url: string, config?: HttpRequestConfig): ApiTask<Response>;
  post(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): ApiTask<Response>;
  put(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig,
  ): ApiTask<Response>;
  delete(url: string, config?: HttpRequestConfig): ApiTask<Response>;
  head(url: string, config?: HttpRequestConfig): ApiTask<Response>;
}
