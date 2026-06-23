const express = require("express");
const registerAdmin = require("../controllers/admin/adminRegister.controller");
const loginAdmin = require("../controllers/admin/adminLogin.controller");
const {
  listAllProfile,
} = require("../controllers/admin/listAllUser.controller");
const verifyToken = require("../utils/verifyToken");
const userBlock = require("../controllers/admin/blockUser.controller");
const router = express.Router();

// AUTH
router.post("/admin-auth-register", registerAdmin);
router.post("/admin-auth-login", loginAdmin);

// LIST ALL USER'S PROFILE
router.get("/admin-list-users", verifyToken, listAllProfile);

// BLOCK USER
router.post("/:userid/block", verifyToken, userBlock);

module.exports = router;
