const throwError = require("../../utils/WebError");

const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, username, email, password } = req.body || {}
        if (!name && !username && !email && !password) {
            return throwError("Please provide at least one filed to update")
        }
        
        console.log("Update User ID: ",userId)

        
        return res.status(200).json({message: "Updated data",})
    } catch (error) {
        console.log("Update User error : ",error);
        return res.status(500).json({message: "INTERNAL SERVER ERROR"})
    }
}
module.exports = updateUser