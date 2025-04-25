import { ApiEither } from "@/feature/common/data/api-task";
import serverDi from "@/feature/common/server.di";
import { userModuleKey } from "@/feature/core/user/data/user-module-key";
import UserRepository, {
  userRepoKey,
} from "@/feature/core/user/domain/i-repo/user.repository.interface";
import { CreateUserParams } from "@/feature/core/user/domain/params/create-user.param-schema";

export default async function createUserUseCase(
  params: CreateUserParams,
): Promise<ApiEither<true>> {
  const repo = serverDi(userModuleKey).resolve<UserRepository>(userRepoKey);

  return repo.create(params)();
}
