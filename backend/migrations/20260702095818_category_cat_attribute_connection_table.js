/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("cat_attribute");
  if (!exists) {
    return knex.schema.createTable("cat_attribute", (table) => {
      table
        .integer("cat_id")
        .unsigned()
        .notNullable()
        .references("cat_id")
        .inTable("categories")
        .onDelete("CASCADE");
      table
        .integer("attribute_id")
        .unsigned()
        .notNullable()
        .references("attribute_id")
        .inTable("attributes")
        .onDelete("CASCADE");
      table.primary(["cat_id", "attribute_id"]);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("cat_attribute");
  if (exists) {
    return knex.schema.dropTable("cat_attribute");
  }
};
