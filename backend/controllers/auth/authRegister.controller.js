const bcrypt = require("bcrypt");
const dbConn = require("../../db/knex");
const { generateToken } = require("../../utils/jwt");
const throwError = require("../../utils/WebError");
const { generateOTP, hashOTP } = require("../../utils/otp");
const { sendOTPMail } = require("../../utils/mailer");
const register = async (req, res) => {
  try {
    // ASK USER FOR FIELD
    const { name, username, email, password } = req.body || {};

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields requried" });
    }

    // NORMALIZE USER INPUT
    const normalizePassword = password.trim();
    const normalizeEmail = email.trim().toLowerCase();
    const normalizeName = name.trim();
    const normalizeUsername = username.trim();

    // HASH PASSOWRD
    const saltRound = parseInt(process.env.SALTROUND) || 10;
    const hashPassword = await bcrypt.hash(normalizePassword, saltRound);

    // Either all operations succeed together, or everything is rolled back if something fails.
    // ROLLBACK :Undo all database changes made during a transaction because something went wrong.
    const createdUserId = await dbConn.transaction(async (trx) => {
      let userId;
      // trx: manages all database queries inside a transaction so they can be committed or rolled back together

      // customer: it's an knex query builder object for the it_ecomm.customers which is created using transaction connection trx
      const customer = trx("it_ecomm.customers");

      // IT CHECK IF USER WITH SAME EMAIL OR USER EXISTS OR NOT !
      const existingUser = await customer
        .where((queryBuilder) => {
          queryBuilder.where({ email: normalizeEmail }).orWhere({
            username: normalizeUsername,
          });
        })
        .first();

      // IF USERS EXISTS CHECK STATUS IF NO USER FOUND WITH ANY STATUS INSERT NEW
      if (existingUser) {
        // IF USER ACTIVE SHOW ALREADY EXISTS
        if (existingUser.status === "active") {
          throwError("User already exists ", 409);
        }
        // ELSE - IF USER BLOCKED SHOW USER BLOCKED
        if (existingUser.status === "blocked") {
          throwError("User is blocked", 403);
        }

        // IF USER IS INACTIVE : User is not deleted from DB, but treated as deleted/disabled.
        // RESTORE USER IF INACTIVE
        // Find the existing user (even if inactive) and update their record, setting their status back to active.
        const [id] = await customer.where({ id: existingUser.id }).update({
          name: normalizeName,
          username: normalizeUsername,
          email: normalizeEmail,
          password: hashPassword,
          status: "active",
          deleted_at: null,
          updated_at: trx.fn.now(), // It access the sql function and now() : it's an databae function for current-timestamp
        });
        userId = existingUser.id;
      }
      // IF NO USER FOUND WITH EXISTING STATUS INSERT NEW
      else {
        const [insertId] = await customer.insert({
          name: normalizeName,
          username: normalizeUsername,
          email: normalizeEmail,
          password: hashPassword,
          status: "active",
          created_at: trx.fn.now(),
          updated_at: trx.fn.now(),
        });
        userId = insertId;
      }

      // FETCHING THE ROLE FROM THE ROLES TABLE!
      const role = await trx("roles").where({ name: "customer" }).first();
      if (!role) {
        throwError("Default role not found", 500);
      }

      // NOW ASSIGNING THE ROLE TO THE USER AS DEFAULT !
      const existsRole = await trx("user_role")
        .where({ user_id: userId, role_id: role.role_id })
        .first();

      if (!existsRole) {
        await trx("user_role").insert({
          user_id: userId,
          role_id: role.role_id,
        });
      }
      // OTP GENERATION
      const otp = generateOTP();
      const otpHash = hashOTP(otp);
      const otpExpiry = new Date(Date.now() + 10 * 60 * 10000);

      await customer.where({ id: userId }).update({
        otp_hash: otpHash,
        otp_expires_at: otpExpiry,
        is_verified: false,
      });

      // SEND MAIL
      await sendOTPMail(normalizeEmail, otp);

      
      return userId;
    });

    // GENERATE JWT TOKEN
    const token = generateToken({ id: createdUserId, email: normalizeEmail });

    return res.status(201).json({
      message: "User registered successfully",
      createdUserId,
      token,
    });
  } catch (error) {
    console.log("REGISTER ERROR", error);
    return res.status(error.status || 500).json({
      message: error.message || "INTERNAL SERVER ERROR",
    });
  }
};

module.exports = register;
