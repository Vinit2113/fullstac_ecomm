const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const brandById = async (req, res) => {
  try {
    const brandId = req.params.brand_id;

    const brands = await dbConn("it_ecomm.brands")
      .select(
        "brand_id",
        "brand_display_name",
        "brand_image",
        "brand_description",
        "brand_is_active",
      )
      .where({ brand_id: brandId, deleted_at: null })
      .first();

    if (!brands) {
      throwError("Brands not found", 404);
    }
    return res
      .status(200)
      .json({ message: "Brands Fetched Successfully", brands });
  } catch (error) {
    console.log("Brand error: ", error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = brandById;
