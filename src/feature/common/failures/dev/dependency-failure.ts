import BaseDevFailure from "@/feature/common/failures/dev/base-dev-failure";

/**
 * This is a failure of not having specific dependency
 */
export default class DependencyFailure extends BaseDevFailure {
  constructor() {
    super("DependencyFailure");
  }
}
