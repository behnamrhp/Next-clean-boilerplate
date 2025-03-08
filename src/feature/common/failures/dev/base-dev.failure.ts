import BaseFailure from "@/feature/common/failures/base.failure";

/**
 * This is a base class for development failures. All dev failures means we as a developer
 *  made a mistake in the process and we should fix it and can be used in monitoring and
 *  should be handled in hotfix ASAP.
 */
export default abstract class BaseDevFailure<
  META_DATA,
> extends BaseFailure<META_DATA> {}
