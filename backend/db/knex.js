const knex = require("knex");
const config = require("../knexfile");

/** 
 * Initializes Knex using the development database settings
This creates a live connection interface (db) to your database
so that we can run queries ! 
 */
const dbConn = knex(config.development);

module.exports = dbConn;
