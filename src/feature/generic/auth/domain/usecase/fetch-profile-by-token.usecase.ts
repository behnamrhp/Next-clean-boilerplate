import ApiTask from "@/feature/common/data/api-task";
import { diResolve } from "@/feature/common/features.di";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import AuthProfile from "@/feature/generic/auth/domain/entity/auth-profile.enity";
import AuthToken from "@/feature/generic/auth/domain/entity/auth-token.entity";
import AuthRepo, {
  authRepoKey,
} from "@/feature/generic/auth/domain/i-repo/auth.repository";

export default function fetchProfileByTokenUsecase(
  token: AuthToken,
): ApiTask<AuthProfile> {
  const repo = diResolve<AuthRepo>(authModuleKey, authRepoKey);
  return repo.fetchProfileByToken(token);
}
