import "server-only";
import serverDi from "@/feature/common/server.di";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import AuthRepo, {
  authRepoKey,
} from "@/feature/generic/auth/domain/i-repo/auth.repository";

export default function logoutUsecase() {
  const repo = serverDi(authModuleKey).resolve<AuthRepo>(authRepoKey);

  return repo.logout();
}
