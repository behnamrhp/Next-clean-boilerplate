"use client";

import { useDI } from "@/bootstrap/di/di-context";
import { NoOverride } from "@/bootstrap/helpers/type-helper";
import IBaseVM from "@/bootstrap/helpers/vm/i-base-vm";
import { useState } from "react";

export default abstract class BaseVM<
  IVM,
  DEP extends object | undefined = undefined,
> implements IBaseVM<IVM>
{
  /* ------------------------------ Dependencies ------------------------------ */
  protected deps!: DEP;

  /* -------------------------------- Abstracts ------------------------------- */
  abstract useVM(): IVM;

  /* -------------------------------------------------------------------------- */
  produce(dep?: DEP) {
    if (dep) this.deps = dep;

    return this;
  }

  /* --------------------------------- Getters -------------------------------- */
  /**
   * You can pass your rerender method after calling useRerender on your vm
   *  so you can access to it in any method
   */
  protected rerender?: () => void;

  /* -------------------------------------------------------------------------- */
  protected get di() {
    return useDI();
  }

  /* -------------------------------------------------------------------------- */
  /**
   * You can use this hook in your useVm method to get rerender method
   * @returns Rerender Method that when ever you call it you can rerender your component
   *  for showing new values
   */
  protected useRerender(): NoOverride<() => void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, reState] = useState(false);

    const rerender = () => reState((prev) => !prev);
    return rerender as NoOverride<() => void>;
  }

  /* -------------------------------------------------------------------------- */
}
