import BaseDevFailure from "@/feature/common/failures/dev/base-dev-failure";

/**
 * This is a failure of not having specific dependency
 */
export default class DependencyFailure<
  META_DATA,
> extends BaseDevFailure<META_DATA> {
  constructor(metadata: META_DATA) {
    super("DependencyFailure", metadata);
  }
}
