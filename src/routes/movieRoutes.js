const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {addMovie, getallMovie, getMovieById, updateMovieById, deleteMovieById} = require("../controllers/movieController")
const {verifyToken} = require("../middleware/authmiddleware")
const { checkRole } = require("../middleware/roleMiddleware")
const {ROLES} = require("../constants/roles")

const router = express.Router();

router.post('/',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), addMovie)
router.get('/getallmovie',getallMovie)
router.get('/getmoviebyid/:movie_id',getMovieById)
router.put('/updatemovie/:movie_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), updateMovieById);
router.delete('/deletemovie/:movie_id',verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN),deleteMovieById)
module.exports = router