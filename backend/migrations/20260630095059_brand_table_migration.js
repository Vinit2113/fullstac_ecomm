/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("brands");
  if (!exists) {
    return knex.schema.createTable("brands", (table) => {
      table.increments("brand_id").primary();
      table.string("brand_name").notNullable();
      table.string("brand_display_name");
      table.string("brand_description");
      table.boolean("brand_is_active").notNullable().defaultTo(true);
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
  const exists = await knex.schema.hasTable("brands");
  if (exists) {
    return knex.schema.dropTable("brands");
  }
};
