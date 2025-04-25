import ApiTask from "@/feature/common/data/api-task";
import AuthProfile, {
  AuthProfileParams,
} from "@/feature/generic/auth/domain/entity/auth-profile.enity";
import AuthToken from "@/feature/generic/auth/domain/entity/auth-token.entity";

export default interface AuthRepo {
  exchangeCodeWithToken(code: string): ApiTask<AuthToken>;
  fetchProfileByToken(token: AuthToken): ApiTask<AuthProfile>;
  getCachedProfile(): ApiTask<AuthProfileParams>;
  getCachedToken(): ApiTask<AuthToken>;
  logout(): ApiTask<true>;
}

export const authRepoKey = "authRepoKey";
