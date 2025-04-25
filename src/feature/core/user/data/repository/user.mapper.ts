import WithPagination from "@/feature/common/class-helpers/with-pagination";
import WithPaginationResponse from "@/feature/common/data/with-pagination-response";
import ResponseFailure from "@/feature/common/failures/dev/response.failure";
import {
  ApiRole,
  CreateUserApiParams,
  UpdateUserApiParams,
  UserResponse,
} from "@/feature/core/user/data/repository/user.repository";
import Role from "@/feature/core/user/domain/entity/enum/role.enum";
import User, {
  UserParams,
} from "@/feature/core/user/domain/entity/user.entity";
import { CreateUserParams } from "@/feature/core/user/domain/params/create-user.param-schema";
import { UpdateUserParams } from "@/feature/core/user/domain/params/update-user.param-schema";

export default class UserMapper {
  static get toApiRole(): Record<Role, ApiRole> {
    return {
      [Role.ADMIN]: ApiRole.ADMIN,
      [Role.USER]: ApiRole.DESIGNER,
      [Role.MANAGER]: ApiRole.MANAGER,
    };
  }

  static get toEntityRole(): Record<ApiRole, Role> {
    return {
      [ApiRole.ADMIN]: Role.ADMIN,
      [ApiRole.DESIGNER]: Role.USER,
      [ApiRole.MANAGER]: Role.MANAGER,
    };
  }

  static mapToEntity(
    response: WithPaginationResponse<UserResponse>,
  ): WithPagination<UserParams> {
    try {
      const usersEntity = response.data.map((user) =>
        new User({
          id: user.id,
          username: user.username,
          role: user.role ? UserMapper.toEntityRole[user.role] : Role.USER,
          displayName: user.display_name ?? "",
        }).toPlainObject(),
      );
      return new WithPagination(usersEntity, response.total).toPlainObject();
    } catch (e) {
      throw new ResponseFailure(e);
    }
  }

  static mapToCreateParams(params: CreateUserParams): CreateUserApiParams {
    return {
      username: params.username,
      password: params.password,
      display_name: params.displayName,
      role: UserMapper.toApiRole[params.role],
    };
  }

  static mapToUpdateParams(params: UpdateUserParams): UpdateUserApiParams {
    return {
      username: params.username,
      display_name: params.displayName,
      role: UserMapper.toApiRole[params.role],
    };
  }
}
