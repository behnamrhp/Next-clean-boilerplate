# Next.js with BFF (Backend for Frontend)

## Table of Contents
- [Next.js with BFF (Backend for Frontend)](#nextjs-with-bff-backend-for-frontend)
  - [Table of Contents](#table-of-contents)
  - [What is BFF](#what-is-bff)
  - [Where BFF is useful](#where-bff-is-useful)
  - [Where BFF is not useful](#where-bff-is-not-useful)
  - [BFF + SSR in Next.js](#bff--ssr-in-nextjs)
  - [Performance: less payload to the browser](#performance-less-payload-to-the-browser)
  - [Endpoint architecture for multiple APIs](#endpoint-architecture-for-multiple-apis)
    - [The problem](#the-problem)
    - [The solution](#the-solution)
    - [Maintainability wins](#maintainability-wins)
  - [Fail fast with functional programming](#fail-fast-with-functional-programming)
  - [Conclusion](#conclusion)

## What is BFF

**Backend for Frontend (BFF)** is an architectural pattern where a dedicated server layer sits between your frontend and upstream services. Instead of the browser calling multiple APIs directly, the BFF:

- Aggregates data from several backend services
- Transforms upstream responses into shapes the UI actually needs
- Handles auth, caching, and error normalization on the server
- Sends only the final, trimmed payload to the client

In this boilerplate, Next.js Server Components, route handlers, and server-side repositories act as the BFF layer. The browser never talks to the backend API or identity provider directly — Next.js does on its behalf.

## Where BFF is useful

BFF shines when:

- **Multiple upstream APIs** — Your UI needs data from a REST backend, an IDP, a CMS, and a payment gateway. A BFF aggregates them in one server round-trip.
- **Different response formats** — Each API returns JSON in its own shape. The BFF normalizes everything before it reaches domain logic.
- **Auth complexity** — Token exchange, cookie management, and header injection happen server-side, keeping secrets off the client.
- **SSR / RSC** — Next.js server components fetch data at render time. The BFF layer fetches, maps, and passes clean props to the client.
- **Mobile vs web differences** — Separate BFFs can serve different clients from the same backend services with tailored payloads.
- **Rate limiting and caching** — Server-side caching of upstream responses reduces load on backend services and speeds up page loads.

## Where BFF is not useful

BFF adds complexity. Skip it or keep it minimal when:

- **Single simple API** — One REST API with a consistent response format and no aggregation needed. Direct client-side fetching may be simpler.
- **Real-time / WebSocket-heavy apps** — BFF is designed for request/response. Streaming and persistent connections often need a different approach.
- **Public static content** — If your app is mostly static pages with no upstream API calls, a BFF layer adds no value.
- **Small teams with one backend** — The maintenance cost of a BFF layer (endpoint classes, mapping, error handling) may outweigh benefits if the backend already returns UI-ready JSON.
- **Third-party SDKs** — Some services (Stripe, Firebase) provide client SDKs designed for direct browser use. Wrapping them in a BFF may be unnecessary.

## BFF + SSR in Next.js

Next.js is a natural fit for BFF because server-side rendering and React Server Components already run code on the server before sending HTML to the browser.

The flow in this boilerplate:

```
Browser request
  → Next.js Server Component / Controller
    → UseCase (domain logic)
      → Repository (data layer)
        → EndpointProvider.backend / .idp
          → HttpBoundary (fetch upstream API)
            → taskMapJsonToResponse (map response)
              → Domain entity / DTO
    → Render HTML with only the data the page needs
  → Browser receives HTML + minimal client JS
```

Key ideas:

1. **Server Components fetch on the server** — No API keys, tokens, or raw upstream responses leak to the browser.
2. **Controllers orchestrate** — They call use cases, handle failures, and pass clean data to views.
3. **Client Components receive props** — The client never sees upstream API shapes, only what the page needs.

This combines SSR's SEO and first-paint benefits with BFF's data aggregation and transformation.

## Performance: less payload to the browser

One of the biggest wins of BFF + SSR is **reduced network payload to the browser**.

Without BFF, a dashboard page might require the client to:

1. Fetch the user profile from the IDP (2 KB)
2. Fetch paginated users from the backend (15 KB)
3. Fetch invoice summary from another service (8 KB)
4. Fetch revenue stats from a third service (5 KB)

That's 4 round-trips and ~30 KB of JSON the browser must download, parse, and merge.

With BFF + SSR in Next.js:

1. The server fetches all four upstream APIs in parallel
2. Maps each response through its endpoint class
3. Aggregates into a single page-specific payload (e.g., 4 KB)
4. Renders HTML with embedded data

The browser receives one HTML response with exactly what the dashboard needs — no extra fields, no upstream metadata, no auth tokens.

Benefits:

- **Faster Time to Interactive** — Less JS parsing and fewer client-side fetch waterfalls
- **Better on slow networks** — One smaller response instead of many
- **Reduced client memory** — No storing full upstream responses in client state
- **Easier scaling** — Server-side caching of upstream responses reduces backend load across all users

## Endpoint architecture for multiple APIs

When a BFF talks to multiple APIs, each API can have a completely different response structure. This boilerplate handles that with **one endpoint class per upstream API**.

### The problem

```
Backend API response:  { result_code: "10000", msg: "Ok", users: [...] }
IDP token response:    { access_token: "...", expires_in: 3600 }
CMS response:          { data: {...}, meta: { pagination: {...} } }
```

If repositories parse these shapes directly, every API change ripples through domain logic, use cases, and UI.

### The solution

Each API gets an endpoint child class that implements `toHttpDataResponse()`:

```ts
// Backend API — handles result_code / error fields
class BackendEndpoint extends Endpoint {
  protected toHttpDataResponse<DATA>(response: BackendResponse<DATA>) {
    if ("error" in response) throw new ArgumentsFailure(response.error);
    return { data: response as DATA, success: true, status: "200" };
  }
}

// IDP — handles OAuth token/profile shapes
class IdpEndpoint extends Endpoint<IdpResponse> {
  protected toHttpDataResponse<DATA>(response: IdpResponse) {
    if ("access_token" in response || "sub" in response) {
      return { data: response as DATA, success: true, status: "200" };
    }
    throw response;
  }
}
```

All responses normalize to the same interface:

```ts
interface IBaseHttpResponse<DATA> {
  status: string;
  message?: string;
  data?: DATA;
  success: boolean;
}
```

### Maintainability wins

| Change | What you update |
|--------|----------------|
| Backend API changes URL version | `BackendEndpoint.apiVersion` |
| IDP adds a new token field | `IdpEndpoint.toHttpDataResponse()` |
| New CMS API added | New `CmsEndpoint` class + `EndpointProvider.cms` |
| Repository logic | Nothing — it uses `IBaseHttpResponse` and domain mappers |

Repositories interact with **endpoint names** (`EndpointProvider.backend.users`, `EndpointProvider.idp.token`), not raw API shapes. This is the core principle that keeps the BFF layer maintainable as upstream APIs evolve.

For implementation details, see [Endpoints Architecture](/catalog/docs/endpoints/endpoint-architecture.md).

## Fail fast with functional programming

The mapping pipeline uses `TaskEither` from fp-ts to enforce **fail fast** — if any step fails, the error propagates immediately as a typed failure without reaching domain logic.

```
HttpBoundary.request(url)                    TaskEither<Failure, Response>
  → taskMapJsonToResponse(endpoint)            TaskEither<Failure, IBaseHttpResponse>
    → endpoint.toHttpResponse(json)            TaskEither<Failure, IBaseHttpResponse>
      → BaseHttpResponse.toHTTPResponse        TaskEither<Failure, IBaseHttpResponse>
        → BaseHttpResponse.getHTTPResponseData TaskEither<Failure, DATA>
          → Domain mapper                      TaskEither<Failure, Entity>
```

At each step, failures are typed `BaseFailure` subclasses:

| Failure | When |
|---------|------|
| `NetworkFailure` | Connection error, timeout |
| `ClientResponseFailure` | HTTP 4xx |
| `ServerResponseFailure` | HTTP 5xx, 3xx |
| `ResponseStructureFailure` | JSON parsed but shape doesn't match |
| `ArgumentsFailure` | API returned a business error in the body |
| Domain failures | `UserUsernameExistsFailure`, `AuthTokenFailure`, etc. |

If the backend API suddenly returns `{ items: [] }` instead of `{ data: [], total: 0 }`, the mapping throws in `toHttpDataResponse`, becomes a `ResponseStructureFailure`, and the use case receives a `Left` — never a partially parsed or undefined entity.

Example in a repository:

```ts
return pipe(
  this.endpoint.HttpBoundary.get(this.endpoint.users),
  taskMapJsonToResponse<UserListResponse>(this.endpoint),
  chain(BaseHttpResponse.getHTTPResponseData),
  map(UserMapper.mapToEntity),
);
```

If any step returns `Left`, the pipe short-circuits. No null checks, no optional chaining through five layers — the failure is explicit and typed.

This combines BFF's response isolation with functional programming's error transparency, giving you confidence that bad upstream data never silently reaches the UI.

## Conclusion

BFF in Next.js is not just a pattern — in this boilerplate it's the foundation of how server-side data flows:

- **Next.js server layer** acts as the BFF, fetching and transforming upstream data
- **Endpoint classes** isolate each API's URL scheme, auth, and response mapping
- **SSR** delivers only the payload the page needs, improving performance and security
- **TaskEither pipelines** fail fast when upstream APIs return unexpected shapes

Together, these pieces let you integrate multiple backend services, evolve API contracts independently, and keep domain logic clean — whether you're building a dashboard, an auth flow, or any server-rendered page that aggregates data from several sources.
