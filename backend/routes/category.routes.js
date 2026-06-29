const express = require("express");
const verifyToken = require("../utils/verifyToken");
const onlyAdmins = require("../middleware/requireAdmin.middleware");
const createCategory = require("../controllers/categories/createCategories.controller");
const listCategories = require("../controllers/categories/listAllCategories.controller");
const router = express.Router();

router.post("/cat-insert", verifyToken, onlyAdmins, createCategory);
router.post("/cat-list", listCategories);

module.exports = router;
