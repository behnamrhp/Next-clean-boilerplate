import { isServer } from "@/bootstrap/helpers/global-helpers";
import di from "@/bootstrap/di/init-di";
import Logger from "../logger/logger.interface";
import { loggerDiKey } from "../logger/logger-di-key";

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

  status: string;

  /* -------------------------------------------------------------------------- */
  metadata: META_DATA | undefined;

  logger?: Logger;

  /* -------------------------------------------------------------------------- */
  constructor(
    message: string,
    namespace: string,
    metadata?: META_DATA,
    status?: string,
  ) {
    this.message = message;
    this.status = status ?? "";
    this.metadata = metadata ?? undefined;
    this.namespace = namespace;
    try {
      this.logger = di.resolve<Logger>(loggerDiKey);
    } catch {
      return;
    }
    this.logHandler();
  }

  /* -------------------------------------------------------------------------- */
  toPlainObject(): BaseFailure<META_DATA> {
    return {
      message: this.message,
      status: this.status,
      metadata: this.metadata,
    } as BaseFailure<META_DATA>;
  }

  /* -------------------------------------------------------------------------- */
  private logHandler() {
    if (!isServer) return;
    this?.logger?.error({
      message: this.message,
      namespace: this.namespace,
      metadata: this.metadata,
    });
  }
  /* -------------------------------------------------------------------------- */
}
