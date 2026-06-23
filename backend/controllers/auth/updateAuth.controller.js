const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");
const bcrypt = require("bcrypt");
require("dotenv").config();

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("Update User ID: ",userId)
    const { name, username, email, password } = req.body || {};

    if (!name && !username && !email && !password) {
      return throwError("Please provide at least one filed to update");
    }

    const customer = dbConn("it_ecomm.customers");

    // CHECK IF USER EXISTS OR NOT
    const existingUser = await customer.clone().where({ id: userId }).first();

    if (!existingUser) {
      return throwError("User not Found", 404);
    }

    const updateData = {
      updated_at: dbConn.fn.now(),
    };

    // UPDATE NAME
    if (name) {
      updateData.name = name.trim();
    }

    // UPDATE USERNAME
    if (username) {
      const normalizeUsername = username.trim();

      // .clone() :creates a copy of a query builder instance so you can modify the copy without affecting the original query.
      const usernameExists = await customer
        .clone()
        .where({ username: normalizeUsername })
        .whereNot({ id: userId })
        .first();

      if (usernameExists) {
        throwError("Username already exists", 409);
      }

      updateData.username = normalizeUsername;
    }

    //   UPDATE EMAIL

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();

      const emailExists = await customer
        .clone()
        .where({ email: normalizedEmail })
        .whereNot({ id: userId })
        .first();

      if (emailExists) {
        throwError("Email already exists", 409);
      }

      updateData.email = normalizedEmail;
    }

    //   UPDATE PASSWORD
    if (password) {
      const saltRound = parseInt(process.env.SALTROUND) || 10;

      updateData.password = await bcrypt.hash(password.trim(), saltRound);
    }

    await customer.clone().where({ id: userId }).update(updateData);

    const updatedUser = await customer
      .where({ id: userId })
      .select("id", "name", "username", "email", "status", "is_verified")
      .first();

    return res.status(200).json({ message: "Updated data", user: updatedUser });
  } catch (error) {
    console.log("Update User error : ", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};
module.exports = updateUser;
