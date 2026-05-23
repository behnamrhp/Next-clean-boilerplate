import Logger from "@/feature/common/logger/logger.interface";
import pino from "pino";

import { isProduction, isServer } from "../../helpers/global-helpers";

export const initLogger = (): Logger => {
  if (!isServer) return {} as Logger;

  const transport =
    process?.stdout?.isTTY || !isProduction
      ? { transport: { target: "pino-pretty" } }
      : {};

  return pino({
    level: isProduction ? "info" : "debug",
    ...transport,
  }) as Logger;
};
