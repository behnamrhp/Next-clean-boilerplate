"use client";

import di from "@/bootstrap/di/init-di";
import { createContext, use } from "react";
import { DependencyContainer } from "tsyringe";

const DiContext = createContext<null | DependencyContainer>(di);

const useDI = () => {
  const di = use(DiContext);

  if (!di) {
    throw new Error("Di has not provided");
  }

  return di;
};

export { DiContext, useDI };
