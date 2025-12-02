const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const express = require("express")
const {AddReservation, GetReservation, DeleteReservation, UpdateReservation, GenerateQRCode} = require("../controllers/reservationController")
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")

const router = express.Router();

router.post('/addreservation', AddReservation);
router.get('/getreservation', GetReservation);
router.delete('/deletereservation', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteReservation)
router.put('/updatereservation/:reservation_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateReservation)
router.get('/:reservation_id/ticket', GenerateQRCode);  // Handles GET request to generate QR code

module.exports = router;