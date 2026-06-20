const express = require("express");
const register = require("../controllers/auth/authRegister.controller");
const verifyOtp = require("../controllers/auth/verify_otp");
const resendOtp = require("../controllers/auth/respondOTP");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
