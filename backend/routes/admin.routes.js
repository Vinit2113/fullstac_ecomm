const express = require("express");
const registerAdmin = require("../controllers/admin/adminRegister.controller");
const loginAdmin = require("../controllers/admin/adminLogin.controller");
const router = express.Router();

// AUTH
router.post("/admin-auth-register", registerAdmin);
router.post("/admin-auth-login", loginAdmin);


module.exports = router
