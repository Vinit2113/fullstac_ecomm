const express = require("express");
const register = require("../controllers/auth/authRegister.controller");
const verifyOtp = require("../controllers/auth/verify_otp.controller");
const resendOtp = require("../controllers/auth/respondOTP.controller");
const authLogin = require("../controllers/auth/authLogin.controller");
const startVerification = require("../controllers/auth/verifyUser.controller");
const forgotPassword = require("../controllers/auth/forgotPassword.controller");
const resetPassword = require("../controllers/auth/resetPassword.controller");
const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", authLogin);

// FORGOT-RESET-PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// VERIFICATION
router.post("/user-verify", startVerification);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
