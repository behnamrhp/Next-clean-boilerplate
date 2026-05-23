// "use client"
import { loggerDiKey } from "@/feature/common/logger/logger-di-key";
import "reflect-metadata";
import { container, DependencyContainer } from "tsyringe";
import { initLogger } from "../boundaries/logger-boundary/logger";
import { isServer } from "../helpers/global-helpers";

/**
 * Serves as a central point for initializing and configuring
 *  the DI container, ensuring that all necessary dependencies
 *  are registered and available for injection throughout the application.
 */
const InitDI = (): DependencyContainer => {
  const di = container.createChildContainer();

  commonRegisters(di);

  return di;
};

const commonRegisters = (di: DependencyContainer) => {
  if (isServer) {
    di.register(loggerDiKey, {
      useValue: initLogger(),
    });
  }
};

const di = InitDI();

export default di;
