const express = require("express");
const app = express();

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes, adminRoutes );

module.exports = app;
