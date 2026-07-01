const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  // It store uploaded files on the system's disk storage
  destination: (req, file, cb) => {
    cb(null, "uploads/brands"); // All uploaded files will be stored in this uploaded folder !
  },
  filename: (req, file, cb) => {
    //Controls the name of the files like what name will be there for the file
    const brandName = req.body.brand_name || "brand";

    //  SANITIZE BRAND NAME
    const safeBrandName = brandName
      .toLowerCase()
      .replace(/\s+/g, "_") // It replace spacing with _
      .replace(/[^a-z0-9_]/g, ""); // It removes unwanted characters/symbols

    const date = new Date();
    const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

    const ext = path.extname(file.originalname);

    const finalName = `${safeBrandName}_${timestamp}${ext}`;

    cb(null, finalName);
  },
});

// FILE FILTER WHICH ACCEPT REQUIRED FILES !

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  console.log("Here is file extension", ext);
  const mime = file.mimetype;
  console.log("Mime Type : ", mime);

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpg, png, webp)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
