/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.schema.alterTable("attributes", (table) => {
    table.string("attribute_display_name");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasColumn(
    "attributes",
    "attribute_display_name",
  );
  if (exists) {
    return knex.schema.alterTable("attributes", (table) => {
      table.dropColumn("attribute_display_name");
    });
  }
};
