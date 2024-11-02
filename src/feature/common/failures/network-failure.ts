import BaseFailure from "./base-failure";

/**
 * Failure for HTTP response when response dosn't have base structure
 */
export default class NetworkFailure extends BaseFailure {
  /* ------------------------------- Constructor ------------------------------ */
  constructor() {
    super("network");
  }
  /* -------------------------------------------------------------------------- */
}
