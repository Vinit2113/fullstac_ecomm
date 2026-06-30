const express = require("express");
const verifyToken = require("../utils/verifyToken");
const onlyAdmins = require("../middleware/requireAdmin.middleware");
const createCategory = require("../controllers/categories/createCategories.controller");
const listCategories = require("../controllers/categories/listAllCategories.controller");
const cat_by_id = require("../controllers/categories/categoryById.controller");
const updateCatById = require("../controllers/categories/updateCategoryById.controller");
const deleteCatById = require("../controllers/categories/deleteCatById.controller");
const restoreCatById = require("../controllers/categories/restoreCatById.controller");
const router = express.Router();

router.post("/cat-insert", verifyToken, onlyAdmins, createCategory);
router.post("/cat-list", listCategories);
router.post("/cat-list-id/:cat_id", cat_by_id);
router.post("/cat-update-id/:cat_id", verifyToken, onlyAdmins, updateCatById);
router.post("/cat-delete-id/:cat_id", verifyToken, onlyAdmins, deleteCatById);
router.post("/cat-restore-id/:cat_id", verifyToken, onlyAdmins, restoreCatById);

module.exports = router;
