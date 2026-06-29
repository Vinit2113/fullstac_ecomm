const dbConn = require("../../db/knex");

const listCategories = async (req, res) => {
  try {
    const categories = await dbConn("it_ecomm.categories")
      .select("cat_id", "cat_display_name", "cat_description", "cat_is_active")
      .where({ deleted_at: null })
      .orderBy("cat_id", "desc");

    return res.status(200).json({
      message: "Categories fetched successfully",
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = listCategories;
