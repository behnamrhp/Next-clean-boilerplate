import { ApiEither } from "@/feature/common/data/api-task";
import serverDi from "@/feature/common/server.di";
import { userModuleKey } from "@/feature/core/user/data/user-module-key";
import UserRepository, {
  userRepoKey,
} from "@/feature/core/user/domain/i-repo/user.repository.interface";
import { UpdateUserParams } from "@/feature/core/user/domain/params/update-user.param-schema";

export default async function updateUserUseCase(
  params: UpdateUserParams,
): Promise<ApiEither<true>> {
  const repo = serverDi(userModuleKey).resolve<UserRepository>(userRepoKey);
  return repo.update(params)();
}
