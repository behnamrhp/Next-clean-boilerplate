import Role from "@/feature/core/user/domain/entity/enum/role.enum";

export type AuthProfileParams = Omit<AuthProfile, "toPlainObject">;

export default class AuthProfile {
  readonly id: string;

  readonly name: string;

  readonly avatar: string;

  readonly role: Role;

  readonly username: string;

  constructor(params: AuthProfileParams) {
    this.id = params.id;
    this.name = params.name;
    this.avatar = params.avatar;
    this.username = params.username;
    this.role = params.role;
  }

  toPlainObject(): AuthProfileParams {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      username: this.username,
      role: this.role,
    };
  }
}
