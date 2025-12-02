const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const { AddSeats, GetSeats, DeleteSeats, UpdateSeats } = require("../controllers/seatsController")
const { verifyToken } = require("../middleware/authmiddleware")
const {checkRole} = require("../middleware/roleMiddleware")
const {ROLES} = require("../constants/roles")
const router = express.Router();


router.post('/addseat', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), AddSeats)
router.get('/getseats', GetSeats);
router.delete('/deleteseats/:seat_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteSeats);
router.put('/updateseat/:seat_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateSeats)

module.exports = router