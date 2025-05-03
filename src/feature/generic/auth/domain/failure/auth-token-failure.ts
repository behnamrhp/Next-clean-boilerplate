import BaseFailure from "@/feature/common/failures/base.failure";

export default class AuthTokenFailure extends BaseFailure<
  { reason: unknown } | undefined
> {
  constructor(metadata?: { reason: unknown }) {
    super("auth-token", "common", metadata);
  }
}
