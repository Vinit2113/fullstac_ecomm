const dbConn = require("../../db/knex");

const getAttributeByIdForAdmin = async (req, res) => {
  try {
    const attributeId = req.params.attribute_id;
    console.log("Here", attributeId);

    const attribute = await dbConn("it_ecomm.attributes")
      .select(
        "attribute_id",
        "attribute_name",
        "attribute_display_name",
        "attribute_description",
        "attribute_is_active",
      )
      .where({ attribute_id: attributeId })
      .first();

    return res
      .status(200)
      .json({ message: "Attribute fetched successfully", attribute });
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR " });
  }
};

module.exports = { getAttributeByIdForAdmin };
