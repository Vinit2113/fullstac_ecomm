const crypto = require("crypto");
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 999999).toString(); // 6 digit otp
};
console.log(generateOTP());

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
  // SHA-256 :It's a one-way cryptographic function
  // SHA-256: It's a fixed algorithm that converts data into a unique fingerprint
  //.update(): It sends data into hashing function
  // .digest("hex"): Finish hashing and give result in hexadecimal format
};

module.exports = { generateOTP, hashOTP };
