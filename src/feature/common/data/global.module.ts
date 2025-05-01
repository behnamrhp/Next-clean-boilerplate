import { DependencyContainer } from "tsyringe";
import { authRepoKey } from "@/feature/generic/auth/domain/i-repo/auth.repository";
import AuthIDPRepo from "@/feature/generic/auth/data/repo/auth.repository";
import FetchHandler from "@/feature/common/data/fetch-handler";

export default function globalModule(di: DependencyContainer) {
  const globalDi = di.createChildContainer();

  globalDi.register(authRepoKey, AuthIDPRepo);
  globalDi.register(FetchHandler, FetchHandler);
  return globalDi;
}
