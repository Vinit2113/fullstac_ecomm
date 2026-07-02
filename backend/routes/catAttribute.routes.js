const express = require("express");
const verifyToken = require("../utils/verifyToken");
const onlyAdmins = require("../middleware/requireAdmin.middleware");
const addAttributeToCategory = require("../controllers/cat_attribute/addAttributeToCategory");

const router = express.Router();

// CREATE
router.post("/map/cat_attribute", verifyToken, onlyAdmins, addAttributeToCategory);

module.exports = router;
