  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.up = async function (knex) {
    return knex.schema.alterTable("customers", (table) => {
      table.boolean("is_verified").defaultTo(false);

      table
        .enu("status", ["active", "inactive", "blocked"], {
          useNative: true,
          enumName: "customer_status",
        })
        .defaultTo("active");

    });
  };

  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async function (knex) {
    return knex.schema.alterTable("customers", (table) => {
      table.dropColumn("is_verified");
      table.dropColumn("status");
    });
  };
