import HttpBoundary, {
  HTTPResponse,
} from "@/bootstrap/boundaries/http-boundary/http-boundary";
import Endpoint from "@/bootstrap/endpoint/endpoint";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import NetworkFailure from "@/feature/common/failures/network.failure";
import { pipe } from "fp-ts/lib/function";
import { chain, tryCatch } from "fp-ts/lib/TaskEither";
import BaseHttpResponse from "@/feature/common/data/http/base-http-response";

/**
 * Converts a fetch JSON response to the endpoint response structure.
 * Catches API response errors and maps them to client or server failures.
 */
export default function taskMapJsonToResponse<DATA, RESPONSE_STRUCT = unknown>(
  endpoint: Endpoint<RESPONSE_STRUCT>,
) {
  return chain((response: Response) =>
    pipe(
      response as HTTPResponse,
      mainLogics<DATA, RESPONSE_STRUCT>(endpoint),
      chain(BaseHttpResponse.toHTTPResponse),
    ),
  );
}

/**
 * Converts a fetch JSON response to the endpoint HTTP structure without
 * validating success status.
 */
export function taskMapJsonToHttpStructure<RESPONSE_STRUCT = unknown>(
  endpoint: Endpoint<RESPONSE_STRUCT>,
) {
  return chain(mainLogics<unknown, RESPONSE_STRUCT>(endpoint));
}

function mainLogics<DATA, RESPONSE_STRUCT>(
  endpoint: Endpoint<RESPONSE_STRUCT>,
) {
  return (r: HTTPResponse) =>
    pipe(
      tryCatch(
        async (): Promise<RESPONSE_STRUCT> => {
          if (r.ok) {
            if (r.data !== undefined) return r.data as RESPONSE_STRUCT;
            const text = await r.text();
            if (!text) return undefined as RESPONSE_STRUCT;
            return JSON.parse(text) as RESPONSE_STRUCT;
          }

          const statusCategory = Number(r.status.toString().at(0));
          const Failure = HttpBoundary.httpStatusToFailure[statusCategory];

          const restInfo = {
            ...r,
            ...(r.data ? { data: r.data } : {}),
          };
          if (Failure)
            throw new Failure({
              status: r.status,
              restInfo,
            });
          throw new NetworkFailure({
            status: r.status,
            restInfo,
          });
        },
        (l) => failureOr(l, new NetworkFailure(l)),
      ),
      chain((response) => endpoint.toHttpResponse<DATA>(response)),
    );
}
