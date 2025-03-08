import BaseDevFailure from "@/feature/common/failures/dev/base-dev.failure";

/**
 * This is a failure when we didn't provice specific dependency.
 */
export default class DependencyFailure<
  META_DATA,
> extends BaseDevFailure<META_DATA> {
  constructor(metadata: META_DATA) {
    super("DependencyFailure", metadata);
  }
}
