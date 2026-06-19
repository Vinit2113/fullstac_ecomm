require("dotenv").config();
// Update with your config settings.
// THE KNEXFILE.JS IS AN CONFIGURATION FILE
// IT CONTAIN INFO FOR DATABASE

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      // It tells where will migration files will be stored ?
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

// AFTER KNEXFILE.JS CONFIGURE RUN [npx knex migrate:make migration_name] : It tells knex to create file named migration_name

// staging: {
//   client: "postgresql",
//   connection: {
//     database: "my_db",
//     user: "username",
//     password: "password",
//   },
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   migrations: {
//     directory: './migrations',
//     tableName: "knex_migrations",

//   },
//   seeds: {
//     directory: './seeds'
//   }
// },

// production: {
//   client: "postgresql",
//   connection: {
//     database: "my_db",
//     user: "username",
//     password: "password",
//   },
//   pool: {
//     min: 2,
//     max: 10,
//   },
//   migrations: {
//     tableName: "knex_migrations",
//   },
// },
