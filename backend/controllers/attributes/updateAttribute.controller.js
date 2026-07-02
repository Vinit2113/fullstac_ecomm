const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const updateAttributeById = async (req, res) => {
  try {
    const attributeId = req.params.attribute_id;

    if (!attributeId) {
      throwError("Attribute ID is required", 400);
    }

    const { attribute_name, attribute_description } = req.body || {};
    if (!attribute_name && !attribute_description) {
      throwError("Error at least one filed", 400);
    }

    const existingAttribute = await dbConn("it_ecomm.attributes")
      .where({
        attribute_id: attributeId,
        attribute_is_active: 1,
      })
      .first();

    if (!existingAttribute) {
      throwError("Attributes not found", 404);
    }

    const updatedData = {
      updated_at: dbConn.fn.now(),
    };

    if (attribute_name) {
      const trimmedAttributeName = attribute_name.trim();
      const normalizedAttributeName = trimmedAttributeName.toLowerCase();

      const duplicate = await dbConn("it_ecomm.attributes")
        .where({ attribute_is_active: 1 })
        .andWhereRaw("LOWER(attribute_name) = ?", [normalizedAttributeName])
        .andWhereNot({ attribute_id: attributeId })
        .first();
      if (duplicate) {
        throwError("Attribute already exists", 409);
      }

      updatedData.attribute_name = normalizedAttributeName;
      updatedData.attribute_display_name = trimmedAttributeName;
    }

    if (attribute_description) {
      updatedData.attribute_description = attribute_description.trim();
    }

    await dbConn("it_ecomm.attributes")
      .where({
        attribute_id: attributeId,
        attribute_is_active: 1,
      })
      .update(updatedData);
    return res.status(200).json({ message: "Attribute updated successfully" });
  } catch (error) {
    console.log(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = updateAttributeById;
