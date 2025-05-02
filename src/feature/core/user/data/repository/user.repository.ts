import BackendEndpoint from "@/bootstrap/endpoint/endpoints/backend-endpoints";
import WithPagination from "@/feature/common/class-helpers/with-pagination";
import ApiTask from "@/feature/common/data/api-task";
import FetchHandler, {
  FetchOptions,
} from "@/feature/common/data/fetch-handler";
import WithPaginationResponse from "@/feature/common/data/with-pagination-response";
import serverDi from "@/feature/common/features.di";
import UserMapper from "@/feature/core/user/data/repository/user.mapper";
import { userModuleKey } from "@/feature/core/user/data/user-module-key";
import User from "@/feature/core/user/domain/entity/user.entity";
import UserUsernameExistsFailure from "@/feature/core/user/domain/failure/user-username-exists.failure";
import UserRepository from "@/feature/core/user/domain/i-repo/user.repository.interface";
import { CreateUserParams } from "@/feature/core/user/domain/params/create-user.param-schema";
import { UpdateUserParams } from "@/feature/core/user/domain/params/update-user.param-schema";
import { pipe } from "fp-ts/lib/function";
import { chain, left, map, right } from "fp-ts/lib/TaskEither";

export enum ApiRole {
  ADMIN = "admin",
  DESIGNER = "designer",
  MANAGER = "manager",
}
export type UserResponse = {
  id: string;
  username: string;
  password: string;
  role?: ApiRole;
  display_name?: string;
};

export type CreateUserApiParams = {
  username: string;
  password?: string;
  role: ApiRole;
  display_name?: string;
};

export type UpdateUserApiParams = {
  username: string;
  display_name?: string;
  role?: ApiRole;
};

export default class UserRepositoryImpl implements UserRepository {
  readonly endpoint: BackendEndpoint;

  private fetchHandler: FetchHandler;

  private readonly userAlreadyExistsErrorMessage = "username already exists";

  constructor() {
    const di = serverDi(userModuleKey);
    this.fetchHandler = di.resolve(FetchHandler);
    this.endpoint = di.resolve(BackendEndpoint);
  }

  create(params: CreateUserParams): ApiTask<true> {
    const options: FetchOptions<CreateUserApiParams> = {
      endpoint: this.endpoint.users,
      method: "POST",
      body: UserMapper.mapToCreateParams(params),
    };
    return pipe(
      this.fetchHandler.fetchWithAuth<
        true | { error: string },
        CreateUserApiParams
      >(options),
      chain((response) => {
        if (
          response instanceof Object &&
          (response as { error: string }).error &&
          typeof (response as { error: string }).error === "string" &&
          (response as { error: string }).error.toLowerCase() ===
            this.userAlreadyExistsErrorMessage
        ) {
          return left(new UserUsernameExistsFailure().toPlainObject());
        }
        return right(true);
      }),
    ) as ApiTask<true>;
  }

  update(params: UpdateUserParams): ApiTask<true> {
    const options: FetchOptions<UpdateUserApiParams> = {
      endpoint: `${this.endpoint.users}/${params.id}`,
      method: "PUT",
      body: UserMapper.mapToUpdateParams(params),
    };
    return this.fetchHandler.fetchWithAuth(options);
  }

  delete(ids: string[]): ApiTask<true> {
    const options: FetchOptions<string[]> = {
      endpoint: this.endpoint.users,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: ids,
    };
    return pipe(
      this.fetchHandler.fetchWithAuth<undefined, string[]>(options),
      map(() => true),
    );
  }

  getPaginatedList(paginationParams: {
    limit?: number;
    skip?: number;
    query?: string;
  }): ApiTask<WithPagination<User>> {
    let queryParams = paginationParams.query
      ? `?query=${paginationParams.query}`
      : "";

    if (
      !Number.isNaN(paginationParams.limit) &&
      !Number.isNaN(paginationParams.skip)
    ) {
      queryParams += `${queryParams ? "&" : "?"}limit=${paginationParams.limit}&offset=${paginationParams.skip}`;
    }
    const options: FetchOptions<undefined> = {
      endpoint: this.endpoint.users + queryParams,
      method: "GET",
    };
    return pipe(
      options,
      this.fetchHandler.fetchWithAuth.bind(this.fetchHandler) as () => ApiTask<
        WithPaginationResponse<UserResponse>
      >,
      map(UserMapper.mapToEntity.bind(this)),
    ) as ApiTask<WithPagination<User>>;
  }
}
