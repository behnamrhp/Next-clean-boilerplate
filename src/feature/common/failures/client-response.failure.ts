import commonLangKey, {
  commonLangNs,
} from "@/feature/common/lang-keys/common.lang-key";
import BaseFailure from "./base.failure";

/**
 * Failure related to mistakes related to client response.
 * In http related to 4xx response.
 */
export default class ClientResponseFailure extends BaseFailure<{
  status: number;
  restInfo: unknown;
}> {
  constructor(metaData?: { status: number; restInfo: unknown }) {
    super(commonLangKey.failure.param, commonLangNs, metaData);
  }
}
