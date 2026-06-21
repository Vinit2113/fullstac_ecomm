/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("customers", (table) => {
    table.string("reset_token");
    table.timestamp("reset_token_expiry");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("customer", (table) => {
    table.dropColumn("reset_token");
    table.dropColumn("reset_token_expiry");
  });
};
