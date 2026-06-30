const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const updateCatById = async (req, res) => {
  try {
    // ✅ FIXED: correct param handling
    const catId = req.params.cat_id;

    if (!catId) {
      throwError("Category ID is required", 400);
    }

    const { cat_name, cat_description } = req.body || {};

    // ✅ Require at least one field
    if (!cat_name && !cat_description) {
      throwError("Enter at least one field", 400);
    }

    // 1. CHECK IF CATEGORY EXISTS
    const existingCategory = await dbConn("it_ecomm.categories")
      .where({
        cat_id: catId,
        deleted_at: null,
      })
      .first();

    if (!existingCategory) {
      throwError("Category not found", 404);
    }

    const updateData = {
      updated_at: dbConn.fn.now(),
    };

    // 2. UPDATE NAME (normalize + duplicate check)
    if (cat_name) {
      const trimmedCatName = cat_name.trim();
      const normalizedCatName = trimmedCatName.toLowerCase();

      const duplicate = await dbConn("it_ecomm.categories")
        .where({ deleted_at: null })
        .andWhereRaw("LOWER(cat_name) = ?", [normalizedCatName])
        .andWhereNot({ cat_id: catId })
        .first();

      if (duplicate) {
        throwError("Category already exists", 409);
      }

      updateData.cat_name = normalizedCatName;
      updateData.cat_display_name = trimmedCatName;
    }

    // 3. UPDATE DESCRIPTION
    if (cat_description) {
      updateData.cat_description = cat_description.trim();
    }

    // 4. UPDATE CATEGORY
    await dbConn("it_ecomm.categories")
      .where({
        cat_id: catId,
        deleted_at: null,
      })
      .update(updateData);

    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = updateCatById;
