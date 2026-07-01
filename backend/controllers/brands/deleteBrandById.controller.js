const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const deleteBrandById = async (req, res) => {
  try {
    const brandId = req.params.brand_id;
    if (!brandId) [throwError("Brand Id is required", 400)];

    // CHECK IF BRAND EXISTS OR NOT
    const brand = await dbConn("it_ecomm.brands")
      .where({ brand_id: brandId })
      .andWhere({ deleted_at: null })
      .first();
    if (!brand) {
      throwError("Brand not foudn or already exists", 404);
    }
    //   SOFT-DELETE
    await dbConn("it_ecomm.brands").where({ brand_id: brandId }).update({
      deleted_at: new Date(),
      brand_is_active: false,
    });
    return res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = deleteBrandById;
