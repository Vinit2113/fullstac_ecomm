// THIS IS A DATABASE MIGRATION SCRIPT
// IT HELP CREATE, UPDATE, ADD/REMOVE, ROLLBACK THE DATA OF THE TABLE

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("customers");

  if (!exists) {
    return knex.schema.createTable("customers", (table) => {
      table.increments("id").primary();
      table.string("name");
      table.string("username", 50).unique().notNullable();
      table.string("email").unique().notNullable();
      table.string("password", 255).notNullable();
      table.timestamps(true, true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("customers");
  if (exists) {
    return knex.schema.dropTable("customers");
  }
};
