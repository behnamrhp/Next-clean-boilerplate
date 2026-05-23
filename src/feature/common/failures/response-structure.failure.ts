import commonLangKey, {
  commonLangNs,
} from "@/feature/common/lang-keys/common.lang-key";
import BaseFailure from "./base.failure";

/**
 * Failure when response of api is sent in wrong way than the convention of api
 */
export default class ResponseStructureFailure<
  META_DATA,
> extends BaseFailure<META_DATA> {
  constructor({
    message,
    metaData,
    status,
  }: {
    message?: string;
    metaData?: META_DATA;
    status?: string;
  }) {
    super(
      message ?? commonLangKey.failure.apiStructure,
      commonLangNs,
      metaData,
      status,
    );
  }
}
