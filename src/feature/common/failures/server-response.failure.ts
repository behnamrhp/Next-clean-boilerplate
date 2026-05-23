import commonLangKey, {
  commonLangNs,
} from "@/feature/common/lang-keys/common.lang-key";
import BaseFailure from "./base.failure";

/**
 * Failure related to mistakes related to server response.
 * In http related to 5xx and 300 response.
 */
export default class ServerResponseFailure extends BaseFailure<{
  status: number;
  restInfo: unknown;
}> {
  constructor(metaData?: { status: number; restInfo: unknown }) {
    super(commonLangKey.failure.apiStructure, commonLangNs, metaData);
  }
}
