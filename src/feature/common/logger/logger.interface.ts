export type LoggerBindings = Record<string, unknown>;

type LogMethod = {
  (obj: LoggerBindings, msg?: string, ...args: unknown[]): void;
  (msg: string, ...args: unknown[]): void;
};

export default interface Logger {
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  trace: LogMethod;
}
