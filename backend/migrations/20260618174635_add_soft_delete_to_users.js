/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("customers", (table) => {
    table.timestamp("deleted_at").nullable().index();
  });

  await knex.schema.alterTable("roles", (table) => {
    table.timestamp("deleted_at").nullable().index();
  });

  await knex.schema.alterTable("permission", (table) => {
    table.timestamp("deleted_at").nullable().index();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("customers", (table) => {
    table.dropColumn("deleted_at");
  });

  await knex.schema.alterTable("roles", (table) => {
    table.dropColumn("deleted_at");
  });

  await knex.schema.alterTable("permission", (table) => {
    table.dropColumn("deleted_at");
  });
};
