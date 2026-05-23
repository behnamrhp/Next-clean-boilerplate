import { constructor } from "tsyringe/dist/typings/types";

export const isServer = typeof window === "undefined";

export const isProduction = process.env.NODE_ENV === "production";

/**
 * Checks if the given value is a class
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isClass(fn: any): fn is constructor<unknown> {
  return typeof fn === "function" && /^(class|function [A-Z])/.test(fn);
}
