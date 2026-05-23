import "reflect-metadata";

vi.mock("server-only", () => ({
  default: {},
  serverConfigs: {},
}));
