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

    /* 
            SELECT 
          c.id,
          c.name,
          c.email,
          c.username,
          c.password,
          c.status,
          c.is_verified,
          r.name AS role
        FROM it_ecomm.customers c
        LEFT JOIN user_role ur 
          ON c.id = ur.user_id
        LEFT JOIN roles r 
          ON ur.role_id = r.role_id
        LEFT JOIN role r2 
          ON ur.role_id = r2.role_id
        WHERE c.email = ?
        LIMIT 1;
    */
    const existingUser = await dbConn("it_ecomm.customers as c")
      .leftJoin("user_role as ur", "c.id", "ur.user_id")
      .leftJoin("roles as r", "ur.role_id", "r.role_id")
      .select("c.id", "c.name", "c.email", "c.username", "c.password", "c.status", "c.is_verified", "r.name as role")
      .where("c.email", normalizeEmail )
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

    console.log("Here is list of existing user: ",existingUser.role);
    

    // GENERATE JWT TOKEN
    const token = generateToken({
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role
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
    return res.status(500).json({message: "INTERNAL SERVER ERROR"})
  }
};

module.exports = authLogin;


// PASSWORD FORGOT AND RESET ... AND OTHER TOMMORROW ! 