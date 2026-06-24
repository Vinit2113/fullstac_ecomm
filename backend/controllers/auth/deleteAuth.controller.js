const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const deleteAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    //   CHECK IF USER EXISTS
    const user = await dbConn("it_ecomm.customers")
      .select("name", "username", "email", "is_verified", "deleted_at")
      .where({
        id: userId,
      })
      .first();
    console.log("Here :", user);

    //   IF USER DOSEN'T EXISTS IN TABLE
    if (!user) {
      throwError("User not found", 404);
    }

    //   IF USER EXISTS AND DELETED ?
    if (user.deleted_at !== null) {
      throwError("User is already deleted", 400);
    }

    //   IF USER EIXSTS AND IS NOT DELETED THEN PROCEED TO SOFT-DELETE
    await dbConn("it_ecomm.customers").where({ id: userId }).update({
      deleted_at: new Date(),
    });

    return res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);

    return res
      .status(error.status || 500)
      .json({ message: error.message || "INTERNAL SERVER ERROR" });
  }
};

module.exports = deleteAuth;
