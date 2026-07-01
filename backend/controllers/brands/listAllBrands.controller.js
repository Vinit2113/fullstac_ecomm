const dbConn = require("../../db/knex");

const listBrands = async (req, res) => {
  try {
    const brands = await dbConn("it_ecomm.brands")
      .select("brand_display_name", "brand_image", "brand_description")
      .where({ deleted_at: null })
      .andWhere({ brand_is_active: true });

    console.log("Here is brands: ", brands);

    return res.status(200).json({
      message: "Brands fetched successfully",
      count: brands.length,
      brands,
    });
  } catch (error) {
    console.log("Brand errors: ", error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = listBrands;
