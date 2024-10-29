"use client"
import di from "@/bootstrap/di/init-di";
import IBaseVM from "@/bootstrap/helpers/vm/i-base-vm";

export default function injectableVm() {
    return function (target: new (...args: unknown[]) => IBaseVM<object>) {
        di.registerInstance(target.name, target);
    };
}