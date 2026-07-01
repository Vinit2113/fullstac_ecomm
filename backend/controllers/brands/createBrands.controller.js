const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const createBrands = async (req, res) => {
  try {
    const { brand_name, brand_description } = req.body;

    //   1. INPUT VALIDATION
    if (!brand_name) {
      throwError("Brand name is required", 400);
    }

    if (!req.file) {
      throwError("Brand image is required", 400);
    }

    //   NORMALIZE DATA
    const trimmedName = brand_name.trim();
    const normalizedBrandName = trimmedName.toLowerCase();

    //   2. CHECK IF BRAND ALREADY EXISTS !
    const existingBrand = await dbConn("it_ecomm.brands")
      .where({
        deleted_at: null,
      })
      .andWhereRaw("LOWER(brand_name) = ?", [normalizedBrandName])
      .first();

    if (existingBrand) {
      throwError("Brand already exists", 409);
    }

    //   3. IMAGE PATH FROM MULTER
    const brandImagePath = req.file.filename;

    //   4. INSERT BRAND
    const newBrand = await dbConn("it_ecomm.brands").insert({
      brand_name: normalizedBrandName, // for search/logic
      brand_display_name: trimmedName, // for UI display
      brand_description: brand_description?.trim() || null,
      brand_image: brandImagePath,
      brand_is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    //   5. GET INSERTED ID
    const brandId = newBrand[0];
    // console.log(brandId);

    //   6. FETCH INSERTED ROW
    const getNewBrand = await dbConn("it_ecomm.brands")
      .where({ brand_id: brandId })
      .first();

    return res.status(200).json({
      message: "Brand created successfully",
      brand: getNewBrand,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(error.statusCode || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = createBrands;
