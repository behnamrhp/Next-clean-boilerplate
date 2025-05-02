import { ApiEither } from "@/feature/common/data/api-task";
import { diResolve } from "@/feature/common/features.di";
import { userModuleKey } from "@/feature/core/user/data/user-module-key";
import UserRepository, {
  userRepoKey,
} from "@/feature/core/user/domain/i-repo/user.repository.interface";

export default async function deleteUsersUseCase(
  ids: string[],
): Promise<ApiEither<true>> {
  const repo = diResolve<UserRepository>(userModuleKey, userRepoKey);
  return repo.delete(ids)();
}
