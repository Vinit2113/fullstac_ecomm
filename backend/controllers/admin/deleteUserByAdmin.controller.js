const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const deleteUser = async (req, res) => {
  try {
    const role = req.user.role;
    console.log("", role);

    const userId = req.params.id;

    console.log("Delete request by role:", role);

    // Only admin allowed
    if (role !== "admin") {
      return throwError("Unauthorized access", 401);
    }

    // Check if user exists and not already deleted
    const user = await dbConn("it_ecomm.customers")
      .where({ id: userId })
      .whereNull("deleted_at")
      .first();

    if (!user) {
      return throwError("User not found or already deleted", 404);
    }

    // Soft delete: update fields instead of deleting row
    await dbConn("it_ecomm.customers").where({ id: userId }).update({
      deleted_at: dbConn.fn.now(),
      status: "inactive",
      updated_at: dbConn.fn.now(),
    });

    return res.status(200).json({
      message: "User soft-deleted successfully",
    });
  } catch (error) {
    console.log("Delete user error", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = {
  deleteUser,
};
