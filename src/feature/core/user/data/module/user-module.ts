import di from "@/bootstrap/di/init-di";
import UserRepositoryImpl from "@/feature/core/user/data/repository/user.repository";
import { userRepoKey } from "@/feature/core/user/domain/i-repo/user.repository.interface";

export default function userModule() {
  const credentialDi = di.createChildContainer();
  credentialDi.register(userRepoKey, UserRepositoryImpl);

  return credentialDi;
}
