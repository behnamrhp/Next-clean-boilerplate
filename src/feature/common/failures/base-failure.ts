import { makeFailureMessage } from "@/feature/common/failures/failure-helpers";

/**
 * This is a class called  BaseFailure  that extends the  Error  class. It is
 *  used as a base class for creating custom failure classes.
 */
export default abstract class BaseFailure<META_DATA> {
  /* ------------------------------- Attributes ------------------------------- */
  private readonly BASE_FAILURE_MESSAGE = "failure";

  /* -------------------------------------------------------------------------- */
  /**
   * Use this message as key lang for failure messages
   */
  message = this.BASE_FAILURE_MESSAGE;

  /* -------------------------------------------------------------------------- */
  metadata: META_DATA | undefined;

  /* -------------------------------------------------------------------------- */
  constructor(key: string, metadata?: META_DATA) {
    this.message = makeFailureMessage(this.message, key);
    this.metadata = metadata ?? undefined;
  }
  /* -------------------------------------------------------------------------- */
}
