"use client";

import { useRef } from "react";

/**
 *
 * @param callback
 * @param time In miliseconds
 */
export default function useThrottle<T extends () => unknown>(
  callback: T,
  time: number = 2000,
) {
  const lastRun = useRef<number>();

  // eslint-disable-next-line func-names
  return function () {
    if (lastRun.current && Date.now() - lastRun.current <= time) return;
    lastRun.current = Date.now();
    callback();
  };
}
