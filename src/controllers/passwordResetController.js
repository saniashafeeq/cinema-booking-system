const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const transporter = require("../config/emailConfig");

// Step 1: User requests password reset
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required!" });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    
    db.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(200).json({
          message: "If an account exists, a reset link has been sent"
        });
      }

      const user = results[0];

      const resetToken = crypto.randomBytes(32).toString("hex");
      
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const tokenExpiry = new Date(Date.now() + 3600000);

      const updateSql = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?";
      
      db.query(updateSql, [hashedToken, tokenExpiry, email], async (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ message: "Failed to generate reset token" });
        }

        // Send email with reset token
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Password Reset Request",
            html: `
              <h2>Password Reset</h2>
              <p>Hi ${user.username},</p>
              <p>Use this token to reset your password:</p>
              <div style="background: #f4f4f4; padding: 15px; margin: 20px 0; border-radius: 5px; font-family: monospace; word-break: break-all;">
                ${resetToken}
              </div>
              <p><strong>This token expires in 1 hour.</strong></p>
              <p>To reset your password, send a POST request to:</p>
              <code>POST ${process.env.BACKEND_URL || 'http://localhost:5000'}/api/reset-password</code>
              <p>With the token in Authorization header and your new password in the body.</p>
              <p>If you didn't request this, ignore this email.</p>
            `
          });

          return res.status(200).json({
            message: "If an account exists, a reset link has been sent"
          });
        } catch (emailErr) {
          return res.status(500).json({ message: "Failed to send email" });
        }
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Step 2: User resets password with token from header
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const resetToken = req.headers['authorization']?.replace('Bearer ', '');

  if (!resetToken) {
    return res.status(400).json({ message: "Reset token is required" });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const sql = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()";
    
    db.query(sql, [hashedToken], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const user = results[0];
      console.log("User found:", user.id, user.email);

      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("Password hashed successfully");

      const updateSql = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?";
      
      db.query(updateSql, [hashedPassword, user.user_id], async (updateErr) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res.status(500).json({ 
            message: "Failed to update password",
            error: updateErr.message 
          });
        }

        // Optional: Send confirmation email
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Password Changed Successfully",
            html: `
              <h2>Password Changed</h2>
              <p>Hi ${user.username},</p>
              <p>Your password has been changed successfully.</p>
              <p>If you didn't make this change, contact support immediately.</p>
            `
          });
        } catch (emailErr) {
          console.log("Confirmation email failed:", emailErr);
          // Don't fail the request if email fails
        }

        return res.status(200).json({ message: "Password reset successful" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {forgotPassword,resetPassword};