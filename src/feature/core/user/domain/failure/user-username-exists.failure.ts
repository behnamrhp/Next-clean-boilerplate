import BaseFailure from "@/feature/common/failures/base.failure";
import userLangKey, {
  userLangNs,
} from "@/feature/common/lang-keys/user.lang-key";

export default class UserUsernameExistsFailure<
  META_DATA = undefined,
> extends BaseFailure<META_DATA> {
  constructor() {
    super(userLangKey.failure.usernameExists, userLangNs);
  }
}
