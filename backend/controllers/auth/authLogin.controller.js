const bcrypt = require("bcrypt");
const throwError = require("../../utils/WebError");
const dbConn = require("../../db/knex");
const { generateToken } = require("../../utils/jwt");

const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      throwError("Email and Password required", 400);
    }

    // NORMALIZE DATA
    const normalizeEmail = email.trim().toLowerCase();
    const normalizePassword = password.trim();

    // CHECK IF USER EXISTS IN DATABASE OR NOT USING EMAIL
    const existingUser = await dbConn("it_ecomm.customers")
      .where({ email: normalizeEmail })
      .first();

    if (!existingUser) {
      throwError("Invalid Email or Password", 401);
    }

    // Check if user is blocked or inactive
    if (existingUser.status === "blocked") {
      throwError("User is Blocked", 403);
    }

    if (existingUser.status === "inactive") {
      throwError("User account is inactive", 403);
    }

    // VERIFY PASSWORD
    const isPasswordMatch = await bcrypt.compare(
      normalizePassword,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throwError("Invalid email or password ", 401);
    }

    // Check email verification
    // if (!user.is_verified) {
    //   throwError("Please verify your email first", 403);
    // }

    // GENERATE JWT TOKEN
    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        username: existingUser.username,
      },
    });
  } catch (error) {
    console.log(error);

    throwError("INTERNAL SERVER ERROR", 500);
  }
};

module.exports = authLogin;


// PASSWORD FORGOT AND RESET ... AND OTHER TOMMORROW ! 