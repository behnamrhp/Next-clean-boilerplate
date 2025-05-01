import WithPagination from "@/feature/common/class-helpers/with-pagination";
import ApiTask from "@/feature/common/data/api-task";
import User from "@/feature/core/user/domain/entity/user.entity";
import { CreateUserParams } from "@/feature/core/user/domain/params/create-user.param-schema";
import { UpdateUserParams } from "@/feature/core/user/domain/params/update-user.param-schema";

export default interface UserRepository {
  getPaginatedList(paginationParams: {
    limit?: number;
    skip?: number;
  }): ApiTask<WithPagination<User>>;

  create(params: CreateUserParams): ApiTask<true>;
  update(params: UpdateUserParams): ApiTask<true>;
  delete(ids: string[]): ApiTask<true>;
}

export const userRepoKey = "userRepoKey";
