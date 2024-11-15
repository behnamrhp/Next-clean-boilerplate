import BaseFailure from "./base-failure";

/**
 * Failure for params failure
 */
export default class ParamsFailure<META_DATA> extends BaseFailure<META_DATA> {
  /* ------------------------------- Constructor ------------------------------ */
  constructor(metadata?: META_DATA) {
    super("params", metadata);
  }
  /* -------------------------------------------------------------------------- */
}
