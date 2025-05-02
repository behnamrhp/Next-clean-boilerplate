import ApiTask from "@/feature/common/data/api-task";
import { failureOrCurry } from "@/feature/common/failures/failure-helpers";
import NetworkFailure from "@/feature/common/failures/network.failure";
import { diResolve } from "@/feature/common/features.di";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import AuthRepo, {
  authRepoKey,
} from "@/feature/generic/auth/domain/i-repo/auth.repository";
import { pipe } from "fp-ts/lib/function";
import { chain, mapLeft, tryCatch } from "fp-ts/lib/TaskEither";

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

  constructor() {
    this.authRepo = diResolve(authModuleKey, authRepoKey);
  }

  fetchWithAuth<
    RESPONSE,
    BODY extends
      | Record<string, unknown>
      | string
      | string[]
      | undefined = undefined,
  >(options: FetchOptions<BODY>): ApiTask<RESPONSE> {
    return pipe(
      this.authRepo.getCachedToken(),
      chain((token) =>
        tryCatch(async () => {
          const response = await fetch(options.endpoint, {
            method: options.method,
            body: JSON.stringify(options.body),
            cache: options.cache,
            headers: {
              Authorization: token.getTokenForHeader(),
              ...(options.headers ?? {}),
            },
          });
          if (!response.body) {
            return undefined;
          }

          return response?.json();
        }, failureOrCurry(new NetworkFailure())),
      ),
      mapLeft((f) => f.toPlainObject()),
    );
  }

  fetchWithoutAuthWithRepsonseStatus<
    BODY extends Record<string, unknown> | undefined = undefined,
  >(options: FetchOptions<BODY>): ApiTask<Response> {
    return pipe(
      this.authRepo.getCachedToken(),
      chain((token) =>
        tryCatch(
          async () =>
            fetch(options.endpoint, {
              method: options.method,
              body: JSON.stringify(options.body),
              headers: {
                Authorization: token.getTokenForHeader(),
              },
            }),
          failureOrCurry(new NetworkFailure()),
        ),
      ),
    );
  }
}
