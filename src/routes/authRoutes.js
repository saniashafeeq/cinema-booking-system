const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {signup, login, getOwnProfile, updateOwnProfile, DeleteProfilebyAdmin, getAllCustomers} = require("../controllers/authController")
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")

const router = express.Router();

router.post('/signup',signup)
router.post('/login', login)
router.get('/getOwnProfile/:user_id',getOwnProfile);
router.patch('/updateOwnProfile/:user_id', verifyToken, updateOwnProfile)
router.delete('/DeleteProfilebyAdmin/:user_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteProfilebyAdmin)
router.get('/getAllCustomers',verifyToken, getAllCustomers)
module.exports = router;