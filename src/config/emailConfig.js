const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

module.exports = transporter;




// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();

// // Create transporter with better configuration
// const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST || 'smtp.gmail.com',
//     port: parseInt(process.env.EMAIL_PORT) || 587,
//     secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     },
//     tls: {
//         rejectUnauthorized: false // Accept self-signed certificates
//     }
// });

// // Verify transporter configuration
// transporter.verify((error, success) => {
//     if (error) {
//         console.error("❌ Email transporter error:", error);
//     } else {
//         console.log("✅ Email server is ready to send messages");
//     }
// });

// module.exports = transporter;