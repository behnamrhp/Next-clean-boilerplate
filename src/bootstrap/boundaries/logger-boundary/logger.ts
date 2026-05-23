import Logger from "@/feature/common/logger/logger.interface";
import pino from "pino";

import { isProduction, isServer } from "../../helpers/global-helpers";

export const initLogger = (): Logger => {
  if (!isServer) return {} as Logger;

  return pino({
    level: isProduction ? "info" : "debug",
  }) as Logger;
};
