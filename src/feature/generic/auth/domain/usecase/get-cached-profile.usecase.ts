import "server-only";
import ApiTask from "@/feature/common/data/api-task";
import { diResolve } from "@/feature/common/features.di";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import { AuthProfileParams } from "@/feature/generic/auth/domain/entity/auth-profile.enity";
import AuthRepo, {
  authRepoKey,
} from "@/feature/generic/auth/domain/i-repo/auth.repository";

export default function getCachedProfile(): ApiTask<AuthProfileParams> {
  const repo = diResolve<AuthRepo>(authModuleKey, authRepoKey);
  return repo.getCachedProfile();
}
