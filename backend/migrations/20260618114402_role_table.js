/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("roles");

  if (!exists) {
    return knex.schema.createTable("roles", (table) => {
      table.increments("role_id").primary();
      table.string("name").unique().notNullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("roles");
  if (exists) {
    return knex.schema.dropTable("roles");
  }
};
