import WithPagination from "@/feature/common/class-helpers/with-pagination";
import { ApiEither } from "@/feature/common/data/api-task";
import serverDi from "@/feature/common/server.di";
import { userModuleKey } from "@/feature/core/user/data/user-module-key";
import { UserParams } from "@/feature/core/user/domain/entity/user.entity";
import UserRepository, {
  userRepoKey,
} from "@/feature/core/user/domain/i-repo/user.repository.interface";

export default async function getUserListUsecase(paginationParams: {
  limit: number;
  skip: number;
  query?: string;
}): Promise<ApiEither<WithPagination<UserParams>>> {
  const repo = serverDi(userModuleKey).resolve<UserRepository>(userRepoKey);
  return repo.getPaginatedList(paginationParams)();
}
