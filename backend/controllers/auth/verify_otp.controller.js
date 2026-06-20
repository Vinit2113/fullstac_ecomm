const dbConn = require("../../db/knex");
const { hashOTP } = require("../../utils/otp");

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const normalizeEmail = email.trim().toLowerCase();

    const user = await dbConn("it_ecomm.customers")
      .where({ email: normalizeEmail })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not foudn" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "Already verified" });
    }

    const otpHash = hashOTP(otp);
    if (otpHash !== user.otp_hash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await dbConn("it_ecomm.customers").where({ id: user.id }).update({
      is_verified: true,
      otp_hash: null,
      otp_expires_at: null,
      updated_at: dbConn.fn.now(),
    });

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR " });
  }
};

module.exports = verifyOtp;
