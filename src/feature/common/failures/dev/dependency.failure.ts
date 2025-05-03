import BaseDevFailure from "@/feature/common/failures/dev/base-dev.failure";
import { commonLangNs } from "@/feature/common/lang-keys/common.lang-key";

/**
 * This is a failure when we didn't provice specific dependency.
 */
export default class DependencyFailure<
  META_DATA,
> extends BaseDevFailure<META_DATA> {
  constructor(metadata: META_DATA) {
    super("DependencyFailure", commonLangNs, metadata);
  }
}
