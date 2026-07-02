const dbConn = require("../../db/knex");

const listAttributes = async (req, res) => {
  try {
    const attributes = await dbConn("it_ecomm.attributes")
      .select("attribute_id", "attribute_display_name", "attribute_is_active")
      .where({ attribute_is_active: true });

    return res.status(200).json({
      message: "Attribute fetched successfully",
      count: attributes.length,
      attributes,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = listAttributes;
