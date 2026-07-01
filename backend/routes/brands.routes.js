const express = require("express");
const upload = require("../middleware/uploads");
const createBrands = require("../controllers/brands/createBrands.controller");
const verifyToken = require("../utils/verifyToken");
const onlyAdmins = require("../middleware/requireAdmin.middleware");
const listBrands = require("../controllers/brands/listAllBrands.controller");
const brandById = require("../controllers/brands/brandsById.controller");
const updateBrandById = require("../controllers/brands/updateBrandById.controller");
const deleteBrandById = require("../controllers/brands/deleteBrandById.controller");
const restoreDeletedBrandById = require("../controllers/brands/restoreDeletedBrandById.controller");

const router = express.Router();

// CREATE
router.post(
  "/create-brand",
  verifyToken,
  onlyAdmins,
  upload.single("brand_image"),
  createBrands,
);

// LISTS
router.post("/list-All", listBrands);
router.post("/show/:brand_id", brandById);

// UPDATE
router.post(
  "/update/:brand_id",
  verifyToken,
  onlyAdmins,
  upload.single("brand_image"),
  updateBrandById,
);

// DELETE
router.post("/delete/:brand_id", verifyToken, onlyAdmins, deleteBrandById);

// RESTORE
router.post(
  "/restore/:brand_id",
  verifyToken,
  onlyAdmins,
  restoreDeletedBrandById,
);

module.exports = router;
