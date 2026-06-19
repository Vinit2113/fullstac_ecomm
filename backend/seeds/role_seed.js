/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("user_role").del();
  await knex("roles").del();

  await knex("roles").insert([{ name: "admin" }, { name: "customer" }]);
};
