const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../config/db");

dotenv.config();

const signup = async (req, res) => {
  const { username, email, phoneNo, password, role_id } = req.body;

  if (!email || !username) {
    return res.status(400).json({ message: "Username and email are required!" });
  }
  const phoneRegex = /^\d{11}$/; // This regex ensures that the phone number is exactly 11 digits
  if (!phoneNo || !phoneRegex.test(phoneNo)) {
    return res.status(400).json({ message: "Phone number must be exactly 11 digits!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let userRoleId = role_id;

    if (!role_id) {
      // If role_id is not provided, get the "customer" role
      const roleQuery = "SELECT role_id FROM roles WHERE role_name = ?";

      // Wrapping the query in a promise
      const roleResult = await new Promise((resolve, reject) => {
        db.query(roleQuery, ["customer"], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      if (roleResult.length === 0) {
        return res.status(400).json({ message: "Customer role not found!" });
      }

      userRoleId = roleResult[0].role_id;
    }
    const insertQuery = "INSERT INTO users (username, email, phoneNo, password, role_id) VALUES (?,?,?,?,?)";

    await new Promise((resolve, reject) => {
      db.query(insertQuery, [username, email, phoneNo,  hashedPassword, userRoleId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error while signing up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required!" });
  }

  try {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.log("Error while fetching user:", err);
        return res.status(500).json({ message: "Server Error" });
      }

      if (results.length === 0) {
        console.log("❌ No user found with that username");
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const user = results[0];
      console.log("✅ User found:", user);
      console.log("Password entered:", password);
      console.log("Password stored in DB:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);  // Log the result of comparison

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { 
            user_id: user.user_id,
            email: user.email,
            role_id: user.role_id  // ✅ Make sure this is included
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: "Login Successful",
        token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role_id: user.role_id,
        },
      });
    });
  } catch (err) {
    console.log("Something went wrong", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOwnProfile = async (req, res) => {
  const { user_id } = req.params;  

  try {
    const sql = "SELECT * FROM users WHERE user_id = ?";
    db.query(sql, [user_id], (error, results) => {
      if (error) {
        console.error("Couldn't get the user:", error);
        return res.status(500).json({ message: "Database query failed!" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Account not found!" });
      }

      //const user = results[0];
      return res.status(200).json({message: "User details fetched successfully", users:results });
    });
  } catch (err) {
    console.error("Error getting the profile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateOwnProfile = async (req, res) => {
  const { user_id } = req.params; 
  const { username, email,phoneNo,  password } = req.body;

  const phoneRegex = /^\d{11}$/; // This regex ensures that the phone number is exactly 11 digits
  if (!phoneNo || !phoneRegex.test(phoneNo)) {
    return res.status(400).json({ message: "Phone number must be exactly 11 digits!" });
  }

  try {
    let updates = [];
    let values = [];

    if (username) {
      updates.push("username = ?");
      values.push(username);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (phoneNo){
      updates.push("phoneNo = ?")
      values.push(phoneNo)
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
    values.push(user_id);

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({ message: "Database update failed!" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "Profile updated successfully" });
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteProfilebyAdmin = async (req, res) => {
  const { role_id } = req.user; // Get role_id from decoded token

  console.log("User Role ID from Token:", role_id); // Log for debugging

  // Check if the user is an Admin (role_id = 2) or Super Admin (role_id = 1)
  if (![1, 2].includes(role_id)) { // Super Admin (1) or Admin (2)
    return res.status(403).json({ message: "Access denied! Only Admin or Super Admin can perform this action." });
  }

  const { user_id } = req.params;

  try {
    const sql = "DELETE FROM users WHERE user_id = ?";
    db.query(sql, [user_id], (error, results) => {
      if (error) {
        console.error("Error while deleting user:", error);
        return res.status(500).json({ message: "Database delete failed!" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found!" });
      }

      return res.status(200).json({ message: "User deleted successfully!" });
    });
  } catch (error) {
    console.log("Error while deleting the user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCustomers = async (req, res) => {
  const { role_id } = req.user; // Get role_id from token

  // Check if the user is an Admin
  if (role_id !== 2) { // Assuming '2' is Admin's role_id
    return res.status(403).json({ message: "Access denied! Only Admin can perform this action." });
  }

  try {
    // Query to fetch all customers
    const sql = "SELECT user_id, username, email, created_at FROM users WHERE role_id = 3"; // Assuming 3 is 'customer' role_id

    db.query(sql, (error, results) => {
      if (error) {
        console.error("Error while fetching customers:", error);
        return res.status(500).json({ message: "Database query failed!" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "No customers found!" });
      }

      return res.status(200).json({
        message: "Customers fetched successfully",
        customers: results,
      });
    });
  } catch (error) {
    console.error("Error while fetching customers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, getOwnProfile, updateOwnProfile, DeleteProfilebyAdmin, getAllCustomers };