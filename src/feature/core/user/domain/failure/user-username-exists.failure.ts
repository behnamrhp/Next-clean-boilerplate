import UserFailure from "@/feature/core/user/domain/failure/user.failure";

export default class UserUsernameExistsFailure extends UserFailure {
  constructor() {
    super("usernameExists");
  }
}
