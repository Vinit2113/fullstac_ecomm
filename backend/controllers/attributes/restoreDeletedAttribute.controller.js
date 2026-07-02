const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const restoreAttributeById = async (req, res) => {
  try {
    const attributeId = req.params.attribute_id;
    if (!attributeId) {
      throwError("Attribute id is required", 400);
    }
    const attribute = dbConn("it_ecomm.attributes")
      .where({ attribute_id: attributeId })
      .andWhereNot({ attribute_is_active: 1 })
      .first();
    if (!attribute) {
      throwError("Attribute not foudn or is still active", 404);
    }

    await dbConn("it_ecomm.attributes")
      .where({ attribute_id: attributeId })
      .update({
        attribute_is_active: 1,
        updated_at: dbConn.fn.now(),
      });

    return res.status(200).json({ message: "Attribute restored successfully" });
  } catch (error) {
    console.log(error);

    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = restoreAttributeById;
