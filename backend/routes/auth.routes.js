const express = require("express");
const register = require("../controllers/auth/authRegister.controller");
const verifyOtp = require("../controllers/auth/verify_otp.controller");
const resendOtp = require("../controllers/auth/respondOTP.controller");
const authLogin = require("../controllers/auth/authLogin.controller");
const startVerification = require("../controllers/auth/verifyUser.controller");
const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", authLogin);

// VERIFICATION
router.post("/user-verify", startVerification);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
