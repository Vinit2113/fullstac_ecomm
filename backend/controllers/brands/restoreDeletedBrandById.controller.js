const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const restoreDeletedBrandById = async (req, res) => {
  try {
    const brandId = req.params.brand_id;

    if (!brandId) {
      throwError("Brand id is required", 400);
    }

    //   CHECK IF BRAND IS EXISTS AND IS DELETED
    const brand = dbConn("it_ecomm.brands")
      .where({
        brand_id: brandId,
      })
      .andWhereNot({ deleted_at: null })
      .first();

    if (!brand) {
      throwError("Brand not found or still active", 404);
    }
    //   RESTORE INACTIVE BRANDS
    await dbConn("it_ecomm.brands").where({ brand_id: brandId }).update({
      deleted_at: null,
      brand_is_active: true,
      updated_at: dbConn.fn.now(),
    });

    return res.status(200).json({ message: "Brand restored successfully" });
  } catch (error) {
    console.log(error);

    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = restoreDeletedBrandById;
