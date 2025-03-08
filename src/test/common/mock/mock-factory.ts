import { Mock } from "moq.ts";

/**
 * To get mock object to mock objects and classes
 */
export function getMock<T>() {
  return new Mock<T>();
}
