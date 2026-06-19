/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("user_role");

  if (!exists) {
    return knex.schema.createTable("user_role", (table) => {
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("customers")
        .onDelete("CASCADE");

      table
        .integer("role_id")
        .unsigned()
        .notNullable()
        .references("role_id")
        .inTable("roles")
        .onDelete("CASCADE");

      table.primary(["user_id", "role_id"]);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("user_role");
  if (exists) {
    return knex.schema.dropTable("user_role");
  }
};
