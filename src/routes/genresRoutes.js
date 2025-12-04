const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {createGenre,getGenres, updateGenre, deleteGenre,}= require("../controllers/genresController");
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware")
const {ROLES} = require("../constants/roles")

const router = express.Router();

/**
 * @swagger
 * /api/genres/createGenre:
 *   post:
 *     summary: Create a new genre (Admin only)
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - genre_name
 *               - description
 *             properties:
 *               genre_name:
 *                 type: string
 *                 example: Action
 *               description:
 *                 type: string
 *                 example: Fast-paced action movies
 *     responses:
 *       201:
 *         description: Genre created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Genre Created successfully
 *                 genre:
 *                   $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       500:
 *         description: Internal server error
 */
router.post('/createGenre', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), createGenre)

/**
 * @swagger
 * /api/genres/getgenres:
 *   get:
 *     summary: Get all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of all genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All genres fetched successfully
 *                 genres:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Genre'
 *       500:
 *         description: Internal server error
 */
router.get('/getgenres', getGenres)

/**
 * @swagger
 * /api/genres/update/{genre_id}:
 *   put:
 *     summary: Update genre by ID (Admin only)
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: genre_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Genre ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genre_name:
 *                 type: string
 *                 example: Action
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:genre_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), updateGenre);

/**
 * @swagger
 * /api/genres/delete/{genre_id}:
 *   delete:
 *     summary: Delete genre by ID (Admin only)
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: genre_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre deleted successfully
 *       400:
 *         description: Invalid genre ID
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Genre not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:genre_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), deleteGenre);



router.post('/createGenre',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), createGenre)
router.get('/getgenres',getGenres)
router.put('/update/:genre_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), updateGenre);
router.delete('/delete/:genre_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), deleteGenre);

module.exports = router;