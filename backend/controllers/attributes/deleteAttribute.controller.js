const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const deleteAttributeById = async (req, res) => {
  try {
    const attributeId = req.params.attribute_id;
    if (!attributeId) {
      throwError("Attribute Id is required", 400);
    }

    const attribute = await dbConn("it_ecomm.attributes")
      .where({ attribute_id: attributeId })
      .andWhere({ attribute_is_active: true })
      .first();

    if (!attribute) {
      throwError("Attribute not found or already exists", 404);
    }

    await dbConn("it_ecomm.attributes")
      .where({ attribute_id: attributeId })
      .update({
        attribute_is_active: false,
      });
    return res.status(200).json({ message: "Attribute deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = deleteAttributeById;
