"use strict";
// Update with your config settings.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
var dotenv = require("dotenv");
require("ts-node/register");
dotenv.config();
var environments = ['development', 'staging', 'production'];
var connection = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 0),
};
var commonConfig = {
    client: 'mysql',
    connection: connection,
    migrations: {
        tableName: 'knex_migrations',
    },
    seeds: {},
};
exports.default = Object.fromEntries(environments.map(function (env) { return [env, commonConfig]; }));
