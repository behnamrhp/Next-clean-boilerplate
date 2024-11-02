import BaseDevFailure from "@/feature/common/failures/dev/base-dev-failure";

/**
 * Failure for needed arguments in a method but sent wrong one
 */
export default class ArgumentsFailure extends BaseDevFailure {
  /* ------------------------------- Constructor ------------------------------ */
  constructor() {
    super("arguments");
  }
  /* -------------------------------------------------------------------------- */
}
