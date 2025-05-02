import { ApiEither } from "@/feature/common/data/api-task";
import { diResolve } from "@/feature/common/features.di";
import { userModuleKey } from "@/feature/core/user/data/user-module-key";
import UserRepository, {
  userRepoKey,
} from "@/feature/core/user/domain/i-repo/user.repository.interface";
import { UpdateUserParams } from "@/feature/core/user/domain/params/update-user.param-schema";

export default async function updateUserUseCase(
  params: UpdateUserParams,
): Promise<ApiEither<true>> {
  const repo = diResolve<UserRepository>(userModuleKey, userRepoKey);
  return repo.update(params)();
}
