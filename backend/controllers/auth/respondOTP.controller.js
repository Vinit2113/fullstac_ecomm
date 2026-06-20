const dbConn = require("../../db/knex");
const { sendOTPMail } = require("../../utils/mailer");
const { generateOTP, hashOTP } = require("../../utils/otp");

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
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

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    await dbConn("it_ecomm.customers")
      .where({ id: user.id })
      .update({
        otp_hash: otpHash,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
      });

    await sendOTPMail(normalizeEmail, otp);
    return res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = resendOtp;

