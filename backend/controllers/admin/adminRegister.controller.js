const dbConn = require("../../db/knex");
const { generateToken } = require("../../utils/jwt");
const throwError = require("../../utils/WebError");
const bcrypt = require('bcrypt')

const registerAdmin  = async (req, res) => {
    try {
        // ADMIN DETAILS REQUIRED
        const {name, email, password } = req.body || {};

        if (!name || !email || !password) {
            throwError("All fields required.", 400)
        };

        // NORMALIZE INPUT
        const normalizeName = name.trim();
        const normalizeEmail = email.trim().toLowerCase();
        const normalizePassword = password.trim();

        // GENERATE USERNAME AUTOMATICALLY
        const generateAdminUsername = (email) => {
            const base = email.split("")[0];
            const unique = Date.now();
            return `admin_${base}_${unique}`
        }

        const username = generateAdminUsername(normalizeEmail);

        // HASH PASSWORD
        const saltRound=  parseInt(process.env.SALTROUND) || 10;
        const hashPassword = await bcrypt.hash(normalizePassword, saltRound)

        const adminId = await dbConn.transaction(async (trx) => {
            const customer = trx("it_ecomm.customers");

            // CHECK IF USER EXISTS OR NOT !
            const existingUser = await customer.where({ email: normalizeEmail }).first();

            if (existingUser) { throwError("Admin already exists with this email", 409) };


            // INSERT ADMIN USER
            const [userId] = await customer.insert({
                name: normalizeName,
                username,
                email: normalizeEmail,
                password: hashPassword,
                status: "active",
                is_verified: true,
                created_at: trx.fn.now(),
                updated_at: trx.fn.now(),
            })

            // GET ADMIN ROLE
            const role = await trx("roles").where({ name: "admin" }).first();
            if (!role) {
                throwError("Admin role not found", 500);
            }
            // Assign role
            await trx("user_role").insert({
                user_id: userId,
                role_id: role.role_id,
            });
            return userId;
        });

        console.log(adminId);
        

        // GENERATE JWT TOKEN
        const token = generateToken({
            id: adminId,
            email: normalizeEmail,
            role: adminId.roleName
        })

        return res.status(201).json({
            message: "Admin registered successfully",
            adminId,
            username,
            token
        })

    } catch (error) {
        console.log("Admin register error: ", error);
        return res.status(500).json({message: "INTERNAL SERVER ERROR"})
    }
}

module.exports = registerAdmin