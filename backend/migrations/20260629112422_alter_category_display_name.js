const { table } = require("../db/knex");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("categories", (table) => {
    table.string("cat_display_name");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasColumn("categories", "cat_display_name");

  if (exists) {
    return knex.schema.alterTable("categories", (table) => {
      table.dropColumn("cat_display_name");
    });
  }
};
