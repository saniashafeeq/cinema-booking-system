const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("=== ROLE CHECK START ===");
        console.log("Required roles:", allowedRoles);
        console.log("User object:", req.user);

        // Check if user data exists (set by verifyToken middleware)
        if (!req.user) {
            console.log("❌ No user data found");
            console.log("=== ROLE CHECK END ===");
            return res.status(401).json({ 
                message: "Authentication required" 
            });
        }

        // Get the user's role_id from the decoded token
        const userRole = req.user.role_id;
        console.log("User role_id:", userRole);

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(userRole)) {
            console.log("❌ Access denied - insufficient permissions");
            console.log("=== ROLE CHECK END ===");
            return res.status(403).json({ 
                message: "Access denied. Insufficient permissions.",
                requiredRoles: allowedRoles,
                yourRole: userRole
            });
        }

        console.log("✅ Role check passed");
        console.log("=== ROLE CHECK END ===");
        // User has required role, proceed
        next();
    };
};

module.exports = { checkRole };