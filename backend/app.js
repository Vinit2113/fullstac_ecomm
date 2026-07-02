const express = require("express");
const app = express();

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const catRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brands.routes");
const attributeRoutes = require("./routes/attribute.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes, adminRoutes);
app.use("/category", catRoutes);
app.use("/attribute", attributeRoutes);
app.use("/brands", brandRoutes);

module.exports = app;
