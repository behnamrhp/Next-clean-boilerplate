import { makeFailureMessage } from "@/feature/common/failures/failure-helpers";

/**
 * This is a class called  BaseFailure  that extends the  Error  class. It is
 *  used as a base class for creating custom failure classes.
 */
export default abstract class BaseFailure {
  /* ------------------------------- Attributes ------------------------------- */
  private readonly BASE_FAILURE_MESSAGE = "failure";

  /* -------------------------------------------------------------------------- */
  /**
   * Use this message as key lang for failure messages
   */
  message = this.BASE_FAILURE_MESSAGE;

  /* -------------------------------------------------------------------------- */
  constructor(key: string) {
    this.message = makeFailureMessage(this.message, key);
  }
  /* -------------------------------------------------------------------------- */
}
