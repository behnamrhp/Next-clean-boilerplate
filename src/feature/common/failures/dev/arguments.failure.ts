import BaseDevFailure from "@/feature/common/failures/dev/base-dev.failure";
import { commonLangNs } from "@/feature/common/lang-keys/common.lang-key";

/**
 * Failure for needed arguments in a method but sent wrong one
 */
export default class ArgumentsFailure<
  META_DATA,
> extends BaseDevFailure<META_DATA> {
  /* ------------------------------- Constructor ------------------------------ */
  constructor(metadata?: META_DATA) {
    super("arguments", commonLangNs, metadata);
  }
  /* -------------------------------------------------------------------------- */
}
