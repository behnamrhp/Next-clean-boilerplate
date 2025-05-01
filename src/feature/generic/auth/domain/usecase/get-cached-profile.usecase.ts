import "server-only";
import ApiTask from "@/feature/common/data/api-task";
import serverDi from "@/feature/common/server.di";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import { AuthProfileParams } from "@/feature/generic/auth/domain/entity/auth-profile.enity";
import AuthRepo, {
  authRepoKey,
} from "@/feature/generic/auth/domain/i-repo/auth.repository";

export default function getCachedProfile(): ApiTask<AuthProfileParams> {
  const repo = serverDi(authModuleKey).resolve<AuthRepo>(authRepoKey);
  return repo.getCachedProfile();
}
