const dbConn = require("../../db/knex");
const { hashOTP } = require("../../utils/otp");
const throwError = require("../../utils/WebError");
const bcrypt = require("bcrypt");
require("dotenv").config();

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token, email } = req.params;
    if (!token || !email || !newPassword) {
      throwError("Token, email and new password required", 400);
    }
    const normalizeEmail = email.trim().toLowerCase();
    const normalizePassword = newPassword.trim();

    const hashedToken = hashOTP(token);

    const user = await dbConn("it_ecomm.customers")
      .where({
        email: normalizeEmail,
        reset_token: hashedToken,
      })
      .first();

    if (!user) {
      throwError("Invalid or Expired token", 400);
    }

    // Check expiry

    if (
      !user.reset_token_expiry ||
      new Date() > new Date(user.reset_token_expiry)
    ) {
      throwError("Reset token expiry", 400);
    }

    // HASH PASSOWRD
    const hashedPassword = await bcrypt.hash(
      newPassword,
      process.env.SALTROUNDS,
    );

    // UPDATE PASSWORD AND CLEAR TOKEN
    await dbConn("it_ecomm.customers").where({ id: user.id }).update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expiry: null,
    });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Reset Password Error", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

module.exports = resetPassword;
