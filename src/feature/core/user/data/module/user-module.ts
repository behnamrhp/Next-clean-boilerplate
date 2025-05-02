import UserRepositoryImpl from "@/feature/core/user/data/repository/user.repository";
import { userRepoKey } from "@/feature/core/user/domain/i-repo/user.repository.interface";
import { DependencyContainer } from "tsyringe";

export default function userModule(di: DependencyContainer) {
  di.register(userRepoKey, UserRepositoryImpl);

  return di;
}
