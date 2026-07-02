const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const addAttributeToCategory = async (req, res) => {
  try {
    const { catId, attributeId } = req.body;
    if (!catId || !attributeId) {
      throwError("Category Id and Attribute Id are requried ", 400);
    }

    //   1. CHECK IF CATEGORY EXISTS WITH THE SAME ID OR NOT !
    const existsCat = await dbConn("it_ecomm.categories")
      .where({ cat_id: catId, deleted_at: null })
      .first();
    if (!existsCat) {
      throwError("Category not found", 404);
    }

    //   2. CHECK IF ATTRIBUTE EXISTS OR NOT !
    const existsAttribute = await dbConn("it_ecomm.attributes")
      .where({
        attribute_id: attributeId,
        attribute_is_active: 1,
      })
      .first();

    if (!existsAttribute) {
      throwError("Attribute not found", 404);
    }

    //   3. CHECK DUPLICATE MAPPING
    const existsCatAttribute = await dbConn("it_ecomm.cat_attribute")
      .where({ cat_id: catId, attribute_id: attributeId })
      .first();
    if (existsCatAttribute) {
      throwError("Mapping already exists", 409);
    }

    //   4. INSERT MAPPING
    await dbConn("it_ecomm.cat_attribute").insert({
      cat_id: catId,
      attribute_id: attributeId,
    });
    return res
      .status(201)
      .json({ message: "Attribute atteched to category successfully" });
  } catch (error) {
    console.log(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = addAttributeToCategory;
