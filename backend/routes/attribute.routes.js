const express = require("express");
const verifyToken = require("../utils/verifyToken");
const onlyAdmins = require("../middleware/requireAdmin.middleware");
const createAttribute = require("../controllers/attributes/createAttributes.controller");
const listAttributes = require("../controllers/attributes/listAllAttributes.controller");
const {
  getAttributeByIdForAdmin,
} = require("../controllers/attributes/getAttributeById.controller");
const updateAttributeById = require("../controllers/attributes/updateAttribute.controller");
const deleteAttributeById = require("../controllers/attributes/deleteAttribute.controller");
const restoreAttributeById = require("../controllers/attributes/restoreDeletedAttribute.controller");
const router = express.Router();

// CREATE
router.post("/insert", verifyToken, onlyAdmins, createAttribute);

// LIST ALL
router.post("/list-all", listAttributes);

// LIST SPECIFIC
router.post(
  "/get/:attribute_id",
  verifyToken,
  onlyAdmins,
  getAttributeByIdForAdmin,
);

// UPDATE ATTRIBUTE
router.post(
  "/update/:attribute_id",
  verifyToken,
  onlyAdmins,
  updateAttributeById,
);

router.post(
  "/delete/:attribute_id",
  verifyToken,
  onlyAdmins,
  deleteAttributeById,
);

router.post(
  "/restore/:attribute_id",
  verifyToken,
  onlyAdmins,
  restoreAttributeById,
);

module.exports = router;
