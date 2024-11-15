import postgres from "postgres";

const envs = process.env;
const dbConfigs = {
  host: envs.POSTGRES_HOST,
  port: Number(envs.POSTGRES_PORT),
  username: envs.POSTGRES_USER,
  password: envs.POSTGRES_PASS,
  database: envs.POSTGRES_DB,
};

export const sql = postgres(dbConfigs);
