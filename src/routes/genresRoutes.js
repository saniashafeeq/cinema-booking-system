const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {createGenre,getGenres, updateGenre, deleteGenre,}= require("../controllers/genresController");
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware")
const {ROLES} = require("../constants/roles")

const router = express.Router();

router.post('/createGenre',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), createGenre)
router.get('/getgenres',getGenres)
router.put('/update/:genre_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), updateGenre);
router.delete('/delete/:genre_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), deleteGenre);

module.exports = router;