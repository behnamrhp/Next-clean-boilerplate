import BaseFailure from "@/feature/common/failures/base-failure";

export default abstract class BaseDevFailure<
  META_DATA,
> extends BaseFailure<META_DATA> {}
