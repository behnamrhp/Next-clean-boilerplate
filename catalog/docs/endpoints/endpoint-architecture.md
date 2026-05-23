# Endpoints Architecture

## Table of Contents
- [Endpoints Architecture](#endpoints-architecture)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Architecture](#architecture)
  - [Base Endpoint](#base-endpoint)
  - [API-specific endpoint classes](#api-specific-endpoint-classes)
  - [EndpointProvider](#endpointprovider)
  - [HTTP Boundary](#http-boundary)
  - [Response mapping pipeline](#response-mapping-pipeline)
  - [Usage in repositories](#usage-in-repositories)
  - [Conclusion](#conclusion)

## Overview

API URLs, versions, and response shapes are among the most volatile parts of any application. In a BFF (Backend for Frontend) setup with Next.js, the server talks to multiple upstream APIs — each with its own URL scheme, auth rules, and JSON structure.

This architecture solves that by:

- Centralizing endpoint URLs per API in dedicated classes
- Mapping each API's raw response shape to a unified internal HTTP response
- Scoping HTTP interceptors (auth headers, token refresh, etc.) per API
- Keeping repositories and use cases agnostic of upstream response formats

See also: [Next.js with BFF](/catalog/docs/bff/nextjs-bff-architecture.md)

## Architecture

```
bootstrap/endpoint/
  endpoint.ts              → Abstract base (URL building + response mapping)
  endpoint-provider.ts     → Factory for API endpoint instances
  endpoints/
    backend-endpoints.ts   → REST backend API (response shape A)
    idp-endpoints.ts       → Identity provider API (response shape B)

bootstrap/boundaries/http-boundary/
  http-boundary.ts         → Fetch wrapper with status-to-failure mapping

feature/common/data/
  http/i-base-http-response.ts  → Unified response interface
  http/base-http-response.ts    → Success/failure validation
  task-map-json-to-response.ts  → JSON → endpoint mapping pipeline
```

Each API gets its own endpoint child class. Repositories only know the API name (`EndpointProvider.backend`, `EndpointProvider.idp`) — never the raw response structure.

## Base Endpoint

Example: [endpoint.ts](/src/bootstrap/endpoint/endpoint.ts)

The abstract `Endpoint` class defines three responsibilities:

1. **URL construction** — `buildEndpoint()`, `compose()`, `sanitizeURL()`
2. **Response mapping** — `toHttpDataResponse()` converts raw API JSON to `IBaseHttpResponse`
3. **Scoped HTTP client** — `HttpBoundary` getter returns an HTTP instance with this endpoint's interceptors

```ts
export default abstract class Endpoint<RESPONSE_STRUCT = any> {
  protected abstract baseURL: string;
  protected abstract apiVersion: string;

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

  toHttpResponse<DATA>(response: RESPONSE_STRUCT): ApiTask<IBaseHttpResponse<DATA>> {
    return tryCatch(
      async () => this.toHttpDataResponse<DATA>(response),
      (l) => failureOr(l, new ResponseStructureFailure({ ... })),
    );
  }
}
```

If `toHttpDataResponse` throws (wrong shape), the error becomes a `ResponseStructureFailure` — fail fast before bad data reaches domain logic.

## API-specific endpoint classes

Each upstream API extends `Endpoint` with its own response type and mapping logic.

### Backend API

Example: [backend-endpoints.ts](/src/bootstrap/endpoint/endpoints/backend-endpoints.ts)

```ts
export type BackendResponse<DATA> =
  | { error: string }
  | DATA;

export default class BackendEndpoint extends Endpoint {
  protected toHttpDataResponse<DATA>(response: BackendResponse<DATA>) {
    if (response && typeof response === "object" && "error" in response) {
      throw new ArgumentsFailure(response.error);
    }
    return { data: response as DATA, success: true, status: "200" };
  }

  get users() {
    return this.buildEndpoint("users");
  }
}
```

### Identity Provider API

Example: [idp-endpoints.ts](/src/bootstrap/endpoint/endpoints/idp-endpoints.ts)

OAuth/OIDC responses use a completely different shape (`access_token`, `sub`, etc.). The IDP endpoint class maps them independently:

```ts
protected toHttpDataResponse<DATA>(response: IdpResponse): IBaseHttpResponse<DATA> {
  if ("access_token" in response || "sub" in response) {
    return { data: response as DATA, success: true, status: "200" };
  }
  throw response; // → ResponseStructureFailure
}
```

When the IDP changes its token response format, you update only `IdpEndpoint` — repositories and use cases stay untouched.

## EndpointProvider

Example: [endpoint-provider.ts](/src/bootstrap/endpoint/endpoint-provider.ts)

A centralized factory gives repositories access to preconfigured endpoint instances by API name:

```ts
export default class EndpointProvider {
  static get backend() {
    return new BackendEndpoint();
  }

  static get idp() {
    return new IdpEndpoint();
  }
}
```

Repositories reference `EndpointProvider.backend.users`, not hardcoded URLs or response parsers.

## HTTP Boundary

Example: [http-boundary.ts](/src/bootstrap/boundaries/http-boundary/http-boundary.ts)

Each endpoint's `HttpBoundary` handles:

- Request/response interceptors scoped to that API
- HTTP status → failure mapping (`4xx` → `ClientResponseFailure`, `5xx` → `ServerResponseFailure`)
- Timeout and network error handling

```ts
static httpStatusToFailure = {
  4: ClientResponseFailure,
  5: ServerResponseFailure,
  3: ServerResponseFailure,
};
```

## Response mapping pipeline

The full pipeline from fetch to domain data:

```
HttpBoundary.request(url)
  → taskMapJsonToResponse(endpoint)     // parse JSON, map HTTP status failures
    → endpoint.toHttpResponse(json)     // map API shape → IBaseHttpResponse
      → BaseHttpResponse.toHTTPResponse // validate success flag
        → BaseHttpResponse.getHTTPResponseData // extract typed data
```

Example: [task-map-json-to-response.ts](/src/feature/common/data/task-map-json-to-response.ts)

Unified response interface:

```ts
interface IBaseHttpResponse<DATA> {
  status: string;
  message?: string;
  data?: DATA;
  success: boolean;
}
```

Every API response passes through this shape before reaching repositories. Domain mappers (`UserMapper`, `AuthTokenMapper`) only work with validated, normalized data.

## Usage in repositories

### Auth repository (IDP API)

Example: [auth.repository.ts](/src/feature/generic/auth/data/repo/auth.repository.ts)

```ts
private endpoint = EndpointProvider.idp;

private requestToken(code: string) {
  return pipe(
    this.endpoint.HttpBoundary.post(this.endpoint.token, params),
    taskMapJsonToResponse<IdpTokenResponse>(this.endpoint),
    chain(BaseHttpResponse.getHTTPResponseData),
    map(this.mapToTokenEntity),
  );
}
```

The repository knows: "call the IDP token endpoint." It does not know the raw `{ access_token, ... }` shape — that lives in `IdpEndpoint`.

### User repository (Backend API)

Example: [user.repository.ts](/src/feature/core/user/data/repository/user.repository.ts)

```ts
private endpoint = EndpointProvider.backend;

create(params: CreateUserParams): ApiTask<true> {
  return this.fetchHandler.fetchWithAuth(this.endpoint, {
    endpoint: this.endpoint.users,
    method: "POST",
    body: UserMapper.mapToCreateParams(params),
  });
}
```

`FetchHandler` accepts an `Endpoint` instance, uses its `HttpBoundary`, and runs the mapping pipeline automatically.

## Conclusion

This endpoint architecture makes the boilerplate BFF-friendly:

- **Per-API isolation** — URL, auth, and response mapping live in one class per upstream API
- **Repository agnosticism** — domain code references endpoint names, not response shapes
- **Fail fast** — invalid response structures become typed failures via functional `TaskEither` pipelines
- **Easy API migration** — change one endpoint class when an upstream API changes version or format

For the broader BFF pattern, SSR combination, and performance rationale, see [Next.js with BFF](/catalog/docs/bff/nextjs-bff-architecture.md).
