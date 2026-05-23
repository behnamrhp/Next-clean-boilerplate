import BaseFailure from "@/feature/common/failures/base.failure";
import commonLangKey, {
  commonLangNs,
} from "@/feature/common/lang-keys/common.lang-key";

export default class UnauthorizedFailure extends BaseFailure<undefined> {
  constructor() {
    super(commonLangKey.failure.unauthorized, commonLangNs, undefined, "401");
  }
}
