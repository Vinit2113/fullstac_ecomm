const dbConn = require("../../db/knex");
const throwError = require("../../utils/WebError");

const userProfile = async (req, res) => {
    try {
        const user_id  = req.user.id;
      
        
        // CHECK IF USER EXISTS OR NOT ! 
        const existingUser = await dbConn("it_ecomm.customers")
            .where({ id: user_id, deleted_at: null })
            .first()
        
        if (!existingUser) {
            throwError("No user found", 404)
        }

        console.log("Here is existing user",existingUser.id);

        return res.status(200).json({
            message: "Here is profile", existingUser: {
                id: user_id,
                name: existingUser.name,
                username: existingUser.username,
                email: existingUser.email,
                verified: existingUser.is_verified,
                status: existingUser.status
        }})
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message: "INTERNAL SERVER ERROR"})
    }
}

module.exports = {userProfile}