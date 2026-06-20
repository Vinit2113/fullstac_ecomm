/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasOtpHash = await knex.schema.hasColumn("customers", "otp_hash");
  const hasOtpExpiry = await knex.schema.hasColumn(
    "customers",
    "otp_expires_at",
  );

  // drop old columns safely
  const hasToken = await knex.schema.hasColumn(
    "customers",
    "verification_token",
  );
  const hasExpiry = await knex.schema.hasColumn(
    "customers",
    "verification_token_expires",
  );

  if (hasToken) {
    await knex.schema.alterTable("customers", (table) => {
      table.dropColumn("verification_token");
    });
  }

  if (hasExpiry) {
    await knex.schema.alterTable("customers", (table) => {
      table.dropColumn("verification_token_expires");
    });
  }

  // add new columns safely
  if (!hasOtpHash || !hasOtpExpiry) {
    await knex.schema.alterTable("customers", (table) => {
      if (!hasOtpHash) {
        table.string("otp_hash", 255).nullable();
      }
      if (!hasOtpExpiry) {
        table.timestamp("otp_expires_at").nullable();
      }
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasOtpHash = await knex.schema.hasColumn("customers", "otp_hash");
  const hasOtpExpiry = await knex.schema.hasColumn(
    "customers",
    "otp_expires_at",
  );

  if (hasOtpHash || hasOtpExpiry) {
    await knex.schema.alterTable("customers", (table) => {
      if (hasOtpHash) table.dropColumn("otp_hash");
      if (hasOtpExpiry) table.dropColumn("otp_expires_at");
    });
  }
};
