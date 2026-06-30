const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const deleteCatById = async (req, res) => {
  try {
    const catId = req.params.cat_id;
    if (!catId) {
      throwError("Category ID is required", 400);
    }

    //   1. CHECK IF CATEGORY EXISTS AND NOT ALREADY DELETED
    const category = await dbConn("it_ecomm.categories")
      .where({ cat_id: catId })
      .andWhere({ deleted_at: null })
      .first();

    if (!category) {
      throwError("Category not found or already exists", 404);
    }

    //   SOFT-DELETE
    await dbConn("it_ecomm.categories").where({ cat_id: catId }).update({
      deleted_at: new Date(),
      cat_is_active: false,
    });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = deleteCatById;
