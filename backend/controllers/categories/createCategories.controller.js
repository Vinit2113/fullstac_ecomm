const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const createCategory = async (req, res) => {
  try {
    const { cat_name, cat_description } = req.body;

    // 1. VALIDATION
    if (!cat_name) {
      throwError("Category name is required", 400);
    }

    const trimmedName = cat_name.trim();
    const normalizedName = trimmedName.toLowerCase();

    // 2. CHECK DUPLICATE USING NORMALIZED VALUE
    const existingCategory = await dbConn("it_ecomm.categories")
      .where({ deleted_at: null })
      .andWhereRaw("LOWER(cat_name) = ?", [normalizedName])
      .first();

    if (existingCategory) {
      throwError("Category already exists", 409);
    }

    // 3. INSERT CATEGORY
    const [newCategory] = await dbConn("it_ecomm.categories")
      .insert({
        cat_name: normalizedName, // for logic/search
        cat_display_name: trimmedName, // for display
        cat_description: cat_description?.trim() || null,
        cat_is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(["cat_id", "cat_name", "cat_description", "cat_is_active"]);

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = createCategory;
