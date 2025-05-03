import commonLangKey, {
  commonLangNs,
} from "@/feature/common/lang-keys/common.lang-key";
import BaseFailure from "./base.failure";

/**
 * Failure for params failure. which means some params are missing or not valid
 */
export default class ParamsFailure<META_DATA> extends BaseFailure<META_DATA> {
  /* ------------------------------- Constructor ------------------------------ */
  constructor(metadata?: META_DATA) {
    super(commonLangKey.failure.param, commonLangNs, metadata);
  }
  /* -------------------------------------------------------------------------- */
}
