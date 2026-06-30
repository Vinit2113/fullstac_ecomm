const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const cat_by_id = async (req, res) => {
  try {
    //   1. GET CAT_ID FORM PARAMS
    const cat_id = req.params.cat_id;
    // console.log(cat_id);

    //   2. GET THE CATEGORY BASED ON THE ID
    const category = await dbConn("it_ecomm.categories")
      .select("cat_id", "cat_display_name", "cat_description", "cat_is_active")
      .where({ cat_id: cat_id, deleted_at: null })
      .first();

    //   CHECK IF CATEGORY EXISTTS OR NOT
    if (!category) {
      throwError("Category not found", 404);
    }

    return res
      .status(200)
      .json({ message: "Category fetched successfully", category });
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR " });
  }
};

module.exports = cat_by_id;
