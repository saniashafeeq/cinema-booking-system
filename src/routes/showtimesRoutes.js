const bcrypt = require("bcryptjs")
//const db = require("../config/db")
const dotenv = require("dotenv")
const express = require("express")
const {Addshowtimes, Getshowtimes, Deleteshowtimes, Updateshowtimes} = require("../controllers/showtimesController")
const {verifyToken} = require("../middleware/authmiddleware")
const {checkRole} =require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")
const router = express.Router();

router.post('/addShowtime', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Addshowtimes)
router.get('/getshowtimes', Getshowtimes);
router.delete('/deleteshowtime/:showtime_id',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Deleteshowtimes);
router.put('/updateshowtime/:showtime_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Updateshowtimes)

module.exports = router