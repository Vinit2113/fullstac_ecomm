/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("admin_access_requests");

  if (!exists) {
    return knex.schema.createTable("admin_access_requests", (table) => {
      table.increments("id").primary();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("customers")
        .onDelete("CASCADE");

      table
        .enum("status", ["pending", "approved", "rejected"])
        .defaultTo("pending");

      table.timestamps(true, true);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return knex.schema.dropTableIfExists("admin_access_requests");
};