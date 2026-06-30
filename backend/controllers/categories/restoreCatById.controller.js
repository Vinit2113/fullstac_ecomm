const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const restoreCatById = async (req, res) => {
  try {
    const catId = req.params.cat_id;

    if (!catId) {
      throwError("Cat Id is requried", 400);
    }

    //   1. CHECK IF CATEGORY EXISTS AND IS DELETED
    const category = dbConn("it_ecomm.categories")
      .where({
        cat_id: catId,
      })
      .andWhereNot({ deleted_at: null })
      .first();

    if (!category) {
      throwError("Category not found or is still active", 404);
    }

    //   2. RESTORE CATEGORY
    await dbConn("it_ecomm.categories")
      .where({ cat_id: catId })
      .update({
        deleted_at: null,
        cat_is_active: true,
        updated_at: dbConn.fn.now(),
      });

    return res.status(200).json({ message: "Category restored successfully" });
  } catch (error) {
    console.log(error);

    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = restoreCatById;
