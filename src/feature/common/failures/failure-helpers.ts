/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseFailure from "@/feature/common/failures/base.failure";

/**
 * This method is supposed to save previous failure of TaskEither
 * to prevent it from loosing and overriding by the new one.
 *
 * Usage example:
 * ```ts
 * tryCatch(
 *  async () => {
 *   ...
 *   throw ValidationFailure();
 *   ...
 *  },
 *  (reason) => failureOr(reason, new UserCreationFailure()),
 * )
 * ```
 * In this example `failureOr` will return already throwed
 * instance of `BaseFailure<any>` which is `ValidationFailure`.
 *
 *
 * @param reason is throwed object.
 * Basically it can be default `Error` or instance of `BaseFailure<any>`.
 * @param failure instance of `BaseFailure<any>` that will be returned
 * if reason is not instance of `BaseFailure<any>`.
 * @returns `BaseFailure<any>`
 */
export function failureOr(
  reason: unknown,
  failure: BaseFailure<any>,
): BaseFailure<any> {
  if (reason instanceof BaseFailure) {
    return reason;
  }
  return failure;
}

export function failureOrCurry(failure: BaseFailure<any>) {
  return (reason: unknown): BaseFailure<any> => {
    if (reason instanceof BaseFailure) {
      return reason;
    }
    return failure;
  };
}

/**
 * Returns a function that maps a BaseFailure<any> instance to a new BaseFailure<any> instance of type IfType using the provided mapping function.
 * @param f A function that maps an instance of IfType to a new instance of BaseFailure<any>.
 * @param ctor A constructor function for IfType.
 * @returns A function that maps a BaseFailure<any> instance to a new BaseFailure<any> instance of type IfType.
 */
export function mapToFailureFrom<IfType extends BaseFailure<any>>(
  f: (t: IfType) => BaseFailure<any>,
  ctor: new (...args: never[]) => IfType,
): (t: BaseFailure<any>) => BaseFailure<any> {
  return mapIfInstance<IfType, BaseFailure<any>>(f, ctor);
}

/**
 * Maps an instance of a class to a response using a provided function.
 *
 * @template IfType - The type of the instance to map.
 * @template Response - The type of the response to map to.
 * @param {function} f - The function to use to map the instance to a response.
 * @param {new (...args: never[]) => IfType} ctor - The constructor function of the instance to map.
 * @returns {(t: IfType | Response) => IfType | Response} - A function that maps the instance to a response using the provided function.
 */
export function mapIfInstance<IfType, Response>(
  f: (t: IfType) => Response,
  ctor: new (...args: never[]) => IfType,
) {
  return (t: IfType | Response) => {
    if (t instanceof ctor) {
      return f(t);
    }
    return t;
  };
}

/**
 * Maps a function to a value if it is not an instance of a given class.
 * @template IfType The type of the value to be mapped.
 * @template Response The type of the mapped value.
 * @param {function} f The function to map the value with.
 * @param {new (...args: never[]) => IfType} ctor The class to check the value against.
 * @returns {function} A function that maps the value if it is not an instance of the given class.
 */
export function mapIfNotInstance<IfType, Response>(
  f: (t: IfType) => Response,
  ctor: new (...args: never[]) => IfType,
) {
  return (t: IfType | Response) => {
    if (t! instanceof ctor) {
      return f(t);
    }
    return t;
  };
}
