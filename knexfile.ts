// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import * as dotenv from 'dotenv';
import type { Knex } from 'knex';
import 'ts-node/register';

dotenv.config();

const environments: string[] = ['development', 'staging', 'production'];

const connection: Knex.MySqlConnectionConfig = {
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  port: Number(process.env.DB_PORT || 0),
};

const commonConfig: Knex.Config = {
  client: 'mysql',
  connection,

  migrations: {
    tableName: 'knex_migrations',
  },
  seeds: {},
};

export default Object.fromEntries(
  environments.map((env: string) => [env, commonConfig]),
);
