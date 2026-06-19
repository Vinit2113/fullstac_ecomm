const bcrypt = require("bcrypt");
const dbConn = require("../../db/knex");
const register = async (req, res) => {
  try {
    // ASK USER FOR FIELD
    const { name, username, email, password } = req.body || {};

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields requried" });
    }

    // HASH PASSOWRD
    const saltRound = process.env.SALTROUND;
    const hashPassword = await bcrypt.hash(password, saltRound);

    // Either all operations succeed together, or everything is rolled back if something fails.
    // ROLLBACK :Undo all database changes made during a transaction because something went wrong.
    const result = await dbConn.transaction(async (trx) => {
      // trx: manages all database queries inside a transaction so they can be committed or rolled back together
      const customers = trx("it_ecomm.customers")
    });

    return res.status(201).json({ message: "Success" });
  } catch (error) {
    console.log("REGISTER ERROR", error);
    return res.status(error.status || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = register;
