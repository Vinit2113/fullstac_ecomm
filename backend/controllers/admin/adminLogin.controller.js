const bcrypt = require("bcrypt");
const dbConn = require("../../db/knex");
const { generateToken } = require("../../utils/jwt");
const throwError = require("../../utils/WebError");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizeEmail = email.trim().toLowerCase();
    const normalizePassword = password.trim();

    // Find User by Email
    const user = await dbConn("it_ecomm.customers")
      .where({ email: normalizeEmail })
      .first();

    if (!user) {
      throwError("Invalid credentials", 401);
    }

    // Check User Status
    if (user.status === "blocked") {
      throwError("User is blocked", 403);
    }

    if (user.status !== "active") {
      throwError("Account is inactive", 403);
    }

    // Check Password
    const isMatch = await bcrypt.compare(
      normalizePassword,
      user.password
    );

    if (!isMatch) {
      throwError("Invalid credentials", 401);
    }

    // Get User Role
    const role = await dbConn("user_role as ur")
      .join("roles as r", "ur.role_id", "r.role_id")
      .where("ur.user_id", user.id)
      .select("r.name")
      .first();

    const roleName = role?.name || "customer";

    // console.log("Here is rolename for token :",roleName);
    

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: roleName,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(error.status || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = loginAdmin;