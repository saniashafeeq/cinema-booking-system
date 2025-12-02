const jwt = require("jsonwebtoken");
const db = require("../config/db");
const dotenv = require("dotenv"); 
dotenv.config();

const authMiddleware = (req, res, next)=>{
    console.log("Request Headers:", req.headers);

    const token = req.headers.authorization?.split(' ')[1];
    console.log("Token Recieved", token);

    if (!token){
        return res.status(401).json({message:"Authorization token missing"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        console.log("Decoded Token", decoded);
        next();
    }catch(err){
        console.log("Token Verification Failed:", err)
        return res.status(403).json({message:"Authorization Failed"})
    }
}

// const verifyToken = (req, res, next)=>{
//     const token = req.header("Authorization")?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, role, email, etc. }
//     //console.log("Decoded Token", decoded);  // Add this line for debugging
//     if (!decoded.role_id) {
//       return res.status(400).json({ 
//           message: "Invalid token structure. Missing role information." 
//       });
//   }
//     next();
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     res.status(400).json({ message: "Invalid token" });
//   }

// }
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  console.log("=== TOKEN VERIFICATION START ===");
  console.log("Token received:", token ? "Yes" : "No");

  if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ 
          message: "Access denied. No token provided." 
      });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded successfully:", decoded);
      
      // Verify that role_id exists in token
      if (!decoded.role_id) {
          console.log("❌ Missing role_id in token");
          return res.status(400).json({ 
              message: "Invalid token structure. Missing role information." 
          });
      }

      req.user = decoded;
      console.log("User set on request:", req.user);
      console.log("=== TOKEN VERIFICATION END ===");
      next();
  } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      console.log("=== TOKEN VERIFICATION END ===");
      return res.status(400).json({ 
          message: "Invalid or expired token",
          error: err.message 
      });
  }
};

module.exports = {authMiddleware, verifyToken}