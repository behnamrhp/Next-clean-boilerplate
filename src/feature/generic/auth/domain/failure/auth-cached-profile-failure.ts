import BaseFailure from "@/feature/common/failures/base.failure";

export default class AuthCachedProfileFailure extends BaseFailure<
  { reason: unknown } | undefined
> {
  constructor(metadata?: { reason: unknown }) {
    super("auth-cached-profile", "common", metadata);
  }
}
