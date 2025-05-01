import "server-only";
import { ApiEither } from "@/feature/common/data/api-task";
import exchangeCodeWithTokenUsecase from "@/feature/generic/auth/domain/usecase/exchange-code-with-token.usecase";
import fetchProfileByTokenUsecase from "@/feature/generic/auth/domain/usecase/fetch-profile-by-token.usecase";
import { pipe } from "fp-ts/lib/function";
import { chain, map } from "fp-ts/lib/TaskEither";

export default async function startAuthUsecase(
  code: string,
): Promise<ApiEither<true>> {
  return pipe(
    code,
    exchangeCodeWithTokenUsecase,
    chain(fetchProfileByTokenUsecase),
    map(() => true),
  )() as Promise<ApiEither<true>>;
}
