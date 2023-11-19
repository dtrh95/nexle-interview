/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('Users').del();
  await knex('Users').insert([
    {
      id: 1,
      firstName: 'Hieu',
      lastName: 'Doan',
      email: 'dtrunghieu96@gmail.com',
      hash: '',
    },
  ]);
};
