const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const listAllProfile = async (req, res) => {
    try {
        const role = req.user.role;
        console.log("Here is role ",role);
        

        if (role === 'customer') {
            return throwError("Unauthorized access", 401)
        }

        const allUser = await dbConn("it_ecomm.customers as c")
            .select("c.id", "c.name", "c.username", "c.email", "r.role_id", "r.name as role_name")
            .leftJoin("it_ecomm.user_role as ur", "c.id", "ur.user_id")
            .leftJoin("it_ecomm.roles as r", "ur.role_id", "r.role_id");
        
        return res.status(200).json({ message: "Users fetched successfully", Data: allUser });
        
        
    } catch (error) {
        console.log("List user error ", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "INTERNAL SERVER ERROR"
        });
    }
}

module.exports = {
    listAllProfile
}