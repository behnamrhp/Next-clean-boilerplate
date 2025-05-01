import Role from "./enum/role.enum";

export type UserParams = Omit<User, "toPlainObject">;

export default class User {
  readonly id: string;

  readonly username: string;

  readonly displayName: string;

  readonly role: Role;

  constructor(params: UserParams) {
    this.id = params.id;
    this.username = params.username;
    this.role = params.role;
    this.displayName = params.displayName;
  }

  toPlainObject(): UserParams {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      displayName: this.displayName,
    };
  }
}
