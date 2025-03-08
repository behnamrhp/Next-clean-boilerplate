import { constructor } from "tsyringe/dist/typings/types";

export const isServer = typeof window === "undefined";

/**
 * Checks if the given value is a class
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isClass(fn: any): fn is constructor<unknown> {
  return typeof fn === "function" && /^(class|function [A-Z])/.test(fn);
}
