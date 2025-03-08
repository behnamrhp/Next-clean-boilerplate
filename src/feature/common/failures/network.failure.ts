import BaseFailure from "./base.failure";

/**
 * Failure for HTTP response when response dosn't have base structure
 */
export default class NetworkFailure<META_DATA> extends BaseFailure<META_DATA> {
  /* ------------------------------- Constructor ------------------------------ */
  constructor(metaData?: META_DATA) {
    super("network", metaData);
  }
  /* -------------------------------------------------------------------------- */
}
