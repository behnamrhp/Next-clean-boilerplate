import BaseFailure from "@/feature/common/failures/base.failure";
import { makeFailureMessage } from "@/feature/common/failures/failure-helpers";

export default abstract class UserFailure extends BaseFailure<undefined> {
  constructor(message: string) {
    super("user");
    this.message = makeFailureMessage(this.message, message);
  }
}
