# Logging Architecture

## Table of Contents
- [Logging Architecture](#logging-architecture)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Why Pino](#why-pino)
  - [Architecture](#architecture)
    - [Logger interface](#logger-interface)
    - [Logger DI key](#logger-di-key)
    - [Logger boundary](#logger-boundary)
    - [DI registration](#di-registration)
  - [Configuration](#configuration)
  - [Usage](#usage)
    - [Automatic logging via failures](#automatic-logging-via-failures)
    - [Manual logging via DI](#manual-logging-via-di)
  - [Development vs Production](#development-vs-production)
  - [Conclusion](#conclusion)

## Overview

Structured logging is essential for monitoring, debugging, and observability in server-side Next.js applications. Instead of scattering `console.log` calls across the codebase, this boilerplate uses [Pino](https://getpino.io/) as a fast, structured JSON logger registered through the DI container.

The logger is **server-only**. On the client, a no-op logger is returned so shared code can safely reference the logger interface without bundling Pino in the browser.

## Why Pino

- **Performance** — Pino is one of the fastest Node.js loggers, with minimal overhead per log line.
- **Structured output** — Logs are JSON objects, making them easy to parse, filter, and ship to monitoring tools (Datadog, Grafana Loki, CloudWatch, etc.).
- **Pretty printing in dev** — `pino-pretty` formats logs for human-readable terminal output during local development.

## Architecture

The logging system follows the same boundary + DI pattern used elsewhere in the boilerplate:

```
feature/common/logger/     → Logger interface + DI key
bootstrap/boundaries/      → Pino initialization (infrastructure)
bootstrap/di/init-di.ts    → Registers logger on the server
feature/common/failures/   → BaseFailure auto-logs errors via DI
```

### Logger interface

The application depends on an abstraction, not Pino directly. This keeps the feature layer decoupled from the logging library.

Example: [logger.interface.ts](/src/feature/common/logger/logger.interface.ts)

```ts
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
```

### Logger DI key

A unique symbol identifies the logger in the DI container:

Example: [logger-di-key.ts](/src/feature/common/logger/logger-di-key.ts)

```ts
export const loggerDiKey = Symbol("logger");
```

### Logger boundary

Infrastructure code initializes Pino with environment-aware settings:

Example: [logger.ts](/src/bootstrap/boundaries/logger-boundary/logger.ts)

```ts
export const initLogger = (): Logger => {
  if (!isServer) return {} as Logger;

  const transport =
    process?.stdout?.isTTY || !isProduction
      ? { transport: { target: "pino-pretty" } }
      : {};

  return pino({
    level: isProduction ? "info" : "debug",
    ...transport,
  }) as Logger;
};
```

Key behaviors:
- Returns a no-op on the client (`!isServer`).
- Uses `pino-pretty` transport when stdout is a TTY or in non-production.
- Sets log level to `info` in production, `debug` otherwise.

### DI registration

The root DI container registers the logger as a singleton on the server:

Example: [init-di.ts](/src/bootstrap/di/init-di.ts)

```ts
const commonRegisters = (di: DependencyContainer) => {
  if (isServer) {
    di.register(loggerDiKey, {
      useValue: initLogger(),
    });
  }
};
```

## Configuration

| Setting | Development | Production |
|---------|-------------|------------|
| Log level | `debug` | `info` |
| Output format | Pretty (via `pino-pretty`) | Raw JSON |
| Transport | `pino-pretty` when TTY | None (stdout JSON) |

The `dev` script pipes Next.js output through `pino-pretty` for readable logs:

```json
"dev": "next dev --turbopack | pino-pretty -c"
```

## Usage

### Automatic logging via failures

Every failure that extends `BaseFailure` automatically logs an error on the server when instantiated. The logger is resolved from DI inside the constructor:

Example: [base.failure.ts](/src/feature/common/failures/base.failure.ts)

```ts
private logHandler() {
  if (!isServer) return;
  this?.logger?.error({
    message: this.message,
    namespace: this.namespace,
    metadata: this.metadata,
  });
}
```

When a `NetworkFailure` or any domain-specific failure is created, a structured error log is emitted with the i18n message key, namespace, and metadata — no manual logging required.

### Manual logging via DI

For custom server-side logging (middleware, repositories, API routes), resolve the logger from DI:

```ts
import di from "@/bootstrap/di/init-di";
import Logger from "@/feature/common/logger/logger.interface";
import { loggerDiKey } from "@/feature/common/logger/logger-di-key";

const logger = di.resolve<Logger>(loggerDiKey);

logger.info({ userId: "123" }, "User fetched successfully");
logger.warn({ endpoint: "/api/users" }, "Slow response detected");
logger.error({ err: error }, "Request failed");
```

Prefer structured bindings (first argument as an object) over string interpolation. This keeps logs queryable in monitoring tools.

## Development vs Production

**Development:**
```
[12:34:56.789] INFO: User fetched successfully
    userId: "123"
```

**Production (JSON on stdout):**
```json
{"level":30,"time":1716484496789,"msg":"User fetched successfully","userId":"123"}
```

In production, pipe stdout to your log aggregator or configure Pino transports for external services.

## Conclusion

This logging architecture replaces ad-hoc `console.log` usage with a structured, DI-backed Pino logger. Failures log automatically, manual logging goes through a typed interface, and the setup adapts to development and production environments without code changes.

For how failures integrate with logging and monitoring, see [Failure error handling](/catalog/docs/failure-error-handling/failure-error-handling.md).
