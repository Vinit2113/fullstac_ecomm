const nodemailer = require("nodemailer");
require("dotenv").config();

// nodemailer.createTransport:It creates a mail transporter object
const transport = nodemailer.createTransport({
  service: "gmail", // It tells nodemailer to use gmail services
  // AUTH: It contian the login credentials for the email account that Nodemailer will use to send emails
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPMail = async (email, otp) => {
  await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP is : ${otp}. It will expire in 10 minutes`,
  });
};

const passwordResetMail = async (email, resetLink) => {
  await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset Request",
    html: `
    <p>You requested password reset</p>
    <p>Click below link (valid for 15   min):</p>
    <a href="${resetLink}">${resetLink}</a>
    `,
  });
};

module.exports = { sendOTPMail, passwordResetMail };
