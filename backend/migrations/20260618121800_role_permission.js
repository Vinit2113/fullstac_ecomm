/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("role_permissions");

  if (!exists) {
    return knex.schema.createTable("role_permissions", (table) => {
      table
        .integer("role_id")
        .unsigned()
        .notNullable()
        .references("role_id")
        .inTable("roles")
        .onDelete("CASCADE");

      table
        .integer("permission_id")
        .unsigned()
        .notNullable()
        .references("permission_id")
        .inTable("permission")
        .onDelete("CASCADE");

      table.primary(["role_id", "permission_id"]);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("role_permissions");
  if (exists) {
    return knex.schema.dropTable("role_permissions");
  }
};
