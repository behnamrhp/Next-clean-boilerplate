import di from "@/bootstrap/di/init-di";
import AuthIDPRepo from "@/feature/generic/auth/data/repo/auth.repository";
import { authRepoKey } from "@/feature/generic/auth/domain/i-repo/auth.repository";

export default function authModule() {
  const authDi = di.createChildContainer();

  authDi.register(authRepoKey, AuthIDPRepo);
  return authDi;
}
