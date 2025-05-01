import ApiTask from "@/feature/common/data/api-task";
import serverDi from "@/feature/common/server.di";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import AuthToken from "@/feature/generic/auth/domain/entity/auth-token.entity";
import AuthRepo, {
  authRepoKey,
} from "@/feature/generic/auth/domain/i-repo/auth.repository";

export default function exchangeCodeWithTokenUsecase(
  code: string,
): ApiTask<AuthToken> {
  const repo = serverDi(authModuleKey).resolve<AuthRepo>(authRepoKey);

  return repo.exchangeCodeWithToken(code);
}
