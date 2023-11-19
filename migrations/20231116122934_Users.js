/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Users', (table) => {
    table.increments('id'); // this represents the primary key.
    table.string('firstName', 32); // this is a column.
    table.string('lastName', 32); // this is a column.
    table.string('email', 64); // this is a column.
    table.string('hash', 255); // this is a column.
    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
