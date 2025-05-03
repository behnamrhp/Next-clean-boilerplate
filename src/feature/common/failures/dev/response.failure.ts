import BaseDevFailure from "@/feature/common/failures/dev/base-dev.failure";
import { commonLangNs } from "@/feature/common/lang-keys/common.lang-key";

/**
 * Failure when repsonse structure which came from one api is wrong
 */
export default class ResponseFailure<
  META_DATA,
> extends BaseDevFailure<META_DATA> {
  /* ------------------------------- Constructor ------------------------------ */
  constructor(metadata?: META_DATA) {
    super("response", commonLangNs, metadata);
  }
  /* -------------------------------------------------------------------------- */
}
