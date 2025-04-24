import { useState, useEffect, useTransition, useRef } from "react";

/**
 *
 * @param action Main server action to run
 * @param onFinished Callback to run after action
 * @returns transitioned action to run and is pending variable
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useServerAction = <P extends any[], R>(
  action: (...args: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void,
): [(...args: P) => Promise<R | undefined>, boolean, R | undefined] => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<R>();
  const [finished, setFinished] = useState(false);
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>();

  useEffect(() => {
    if (!finished) return;

    if (onFinished) onFinished(result);
    resolver.current?.(result);
  }, [result, finished, onFinished]);

  const runAction = async (...args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(...args).then((data) => {
        setResult(data);
        setFinished(true);
      });
    });

    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  return [runAction, isPending, result];
};
