/* eslint-disable no-console */
import { isServer } from "@/bootstrap/helpers/global-helpers";

/**
 * This class can be used as a base class for creating custom failure classes.
 * With this class you can set message and metadata, with messages and extending
 *  you can create your failure messages hierarchy and automatically by syncing langKey
 *  with the hirerarchy of failure messages.
 * For example if you pass a key of `user` to the constructor of `UserCreationFailure`
 *  so in langKey you can have failure message `faiure.user` so automatically,
 *  you can show translated error message everywhere in the app.
 * Also you can use this failure message to have grained control over failures.
 */
export default abstract class BaseFailure<META_DATA> {
  /* -------------------------------- Abstracts ------------------------------- */
  namespace: string;

  /* -------------------------------------------------------------------------- */
  /**
   * Use this message as key lang for failure messages
   */
  message: string;

  /* -------------------------------------------------------------------------- */
  metadata: META_DATA | undefined;

  /* -------------------------------------------------------------------------- */
  constructor(message: string, namespace: string, metadata?: META_DATA) {
    this.message = message;
    this.metadata = metadata ?? undefined;
    this.namespace = namespace;
    this.logHandler();
  }

  /* -------------------------------------------------------------------------- */
  toPlainObject(): BaseFailure<META_DATA> {
    return {
      message: this.message,
      metadata: this.metadata,
    } as BaseFailure<META_DATA>;
  }

  /* -------------------------------------------------------------------------- */
  private logHandler() {
    if (isServer) {
      console.log(
        `Error happened in ${this.namespace} namespace, langKey is: ${this.message}, metadata: ${JSON.stringify(this.metadata)}`,
      );
    }
  }
  /* -------------------------------------------------------------------------- */
}
