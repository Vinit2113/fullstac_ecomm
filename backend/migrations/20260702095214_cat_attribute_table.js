/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("attributes");
  if (!exists) {
    return knex.schema.createTable("attributes", (table) => {
      table.increments("attribute_id").primary();
      table.string("attribute_name").notNullable();
      table.string("attribute_description");
      table.boolean("attribute_is_active").notNullable().defaultTo(true);
      table.timestamps(true, true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("attribute");
  if (exists) {
    return knex.schema.dropTable("attribute");
  }
};
