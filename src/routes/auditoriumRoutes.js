const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {AddAuditorium, UpdateAuditorium, getAudi, DeleteAudi} = require("../controllers/auditoriumController");
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")

const router = express.Router();

router.post('/addaudi',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), AddAuditorium);
router.put('/updateaudi/:auditorium_id',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateAuditorium);
router.get('/getAudi',getAudi);
router.delete('/deleteAudi/:auditorium_id',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteAudi)
module.exports = router