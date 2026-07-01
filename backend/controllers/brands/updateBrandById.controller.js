const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");
const path = require("path");
const fs = require("fs");

const updateBrandById = async (req, res) => {
  try {
    const brandId = req.params.brand_id;
    const { brand_name, brand_description, brand_is_active } = req.body;

    //   1. CHECK IF BRAND EXISTS
    const existingBrands = await dbConn("it_ecomm.brands")
      .where({
        brand_id: brandId,
        deleted_at: null,
      })
      .first();

    if (!existingBrands) {
      throwError("Brand not found", 404);
    }

    //   2. STORED UPDATED DATA
    const updatedData = {
      updated_at: new Date(),
    };

    //   3. UPDATE BRAND NAME
    if (brand_name) {
      const trimmedBrandName = brand_name.trim();
      const normalizedBrandName = trimmedBrandName.toLowerCase();

      // CHECK DUPLICATE NAME
      const duplicateBrand = await dbConn("it_ecomm.brands")
        .whereNull("deleted_at")
        .whereNot("brand_id", brandId)
        .andWhereRaw("LOWER(brand_name) = ?", [normalizedBrandName])
        .first();

      if (duplicateBrand) {
        throwError("Brand already exists ", 409);
      }

      updatedData.brand_name = normalizedBrandName;
      updatedData.brand_display_name = trimmedBrandName;
    }

    //   4. UPDATE DESCRIPTION
    if (brand_description !== undefined) {
      updatedData.brand_description = brand_description.trim() || null;
    }

    // 5. UPDATE ACTIVE STATUS
    if (brand_is_active !== undefined) {
      updatedData.brand_is_active =
        brand_is_active === true ||
        brand_is_active === "true" ||
        brand_is_active == 1;
    }

    //   6. IMAGE UPDATE
    if (req.file) {
      // UPDATE IMAGE
      if (existingBrands.brand_image) {
        const oldImagePath = path.join(
          __dirname,
          "../../uploads/brands",
          existingBrands.brand_image,
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // it'll delete the image of that path in synchornously
        }
      }
      updatedData.brand_image = req.file.filename;
    }

    //   7. UPDATE DATA IN DATABASE
    await dbConn("it_ecomm.brands")
      .where({
        brand_id: brandId,
      })
      .update(updatedData);

    //   8. FETCH UPDATED DATA
    const updatedBrand = await dbConn("it_ecomm.brands")
      .where({
        brand_id: brandId,
      })
      .first();

    return res
      .status(200)
      .json({ message: "Brand updated successfully", brand: updatedBrand });
  } catch (error) {
    console.log(error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = updateBrandById;
