// Define role IDs as constants to avoid magic numbers
const ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    CUSTOMER: 3
};

// Helper function to check if role is admin or super admin
const isAdmin = (roleId) => {
    return roleId === ROLES.SUPER_ADMIN || roleId === ROLES.ADMIN;
};

module.exports = { ROLES, isAdmin };