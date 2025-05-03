import BaseFailure from "@/feature/common/failures/base.failure";

export default class AuthProfileFailure extends BaseFailure<
  { reason: unknown } | undefined
> {
  constructor(metadata?: { reason: unknown }) {
    super("auth-profile", "common", metadata);
  }
}
