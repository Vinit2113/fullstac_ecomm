/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("categories");

  if (!exists) {
    return knex.schema.createTable("categories", (table) => {
      table.increments("cat_id").primary();
      table.string("cat_name").notNullable();
      table.string("cat_description");
      table.boolean("cat_is_active").notNullable().defaultTo(true);
      table.timestamps(true, true);
      table.timestamp("deleted_at").nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("categories");
  if (exists) {
    return knex.schema.dropTable("categories");
  }
};
