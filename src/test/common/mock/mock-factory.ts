import { Mock } from "moq.ts";

export function getMock<T>() {
  return new Mock<T>();
}
