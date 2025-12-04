const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {addMovie, getallMovie, getMovieById, updateMovieById, deleteMovieById} = require("../controllers/movieController")
const {verifyToken} = require("../middleware/authmiddleware")
const { checkRole } = require("../middleware/roleMiddleware")
const {ROLES} = require("../constants/roles")

const router = express.Router();

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Add a new movie (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - poster_url
 *               - genre_id
 *               - duration_minutes
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               description:
 *                 type: string
 *                 example: A mind-bending thriller
 *               poster_url:
 *                 type: string
 *                 example: https://example.com/poster.jpg
 *               genre_id:
 *                 type: integer
 *                 example: 1
 *               duration_minutes:
 *                 type: integer
 *                 example: 148
 *     responses:
 *       201:
 *         description: Movie added successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), addMovie)

/**
 * @swagger
 * /api/movies/getallmovie:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of all movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 movie:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error
 */
router.get('/getallmovie', getallMovie)

/**
 * @swagger
 * /api/movies/getmoviebyid/{movie_id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 movie:
 *                   $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.get('/getmoviebyid/:movie_id', getMovieById)

/**
 * @swagger
 * /api/movies/updatemovie/{movie_id}:
 *   put:
 *     summary: Update movie by ID (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               poster_url:
 *                 type: string
 *               genre_id:
 *                 type: integer
 *               duration_minutes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.put('/updatemovie/:movie_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), updateMovieById);

/**
 * @swagger
 * /api/movies/deletemovie/{movie_id}:
 *   delete:
 *     summary: Delete movie by ID (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       400:
 *         description: Invalid movie ID
 *       403:
 *         description: Access denied
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deletemovie/:movie_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), deleteMovieById)


router.post('/',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), addMovie)
router.get('/getallmovie',getallMovie)
router.get('/getmoviebyid/:movie_id',getMovieById)
router.put('/updatemovie/:movie_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), updateMovieById);
router.delete('/deletemovie/:movie_id',verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN),deleteMovieById)
module.exports = router