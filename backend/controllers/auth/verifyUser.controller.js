const dbConn = require("../../db/knex");
const { sendOTPMail } = require("../../utils/mailer");
const { generateOTP, hashOTP } = require("../../utils/otp");
const throwError = require("../../utils/WebError");

const startVerification = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const normalizeEmail = email.trim().toLowerCase();

    const user = await dbConn("it_ecomm.customers")
      .where({ email: normalizeEmail })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "Already verified" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);

    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await dbConn("it_ecomm.customers").where({ id: user.id }).update({
      otp_hash: otpHash,
      otp_expires_at: expiry,
      updated_at: dbConn.fn.now(),
    });

    // Send email
    await sendOTPMail(normalizeEmail, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("START VERIFICATION ERROR:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = startVerification;
