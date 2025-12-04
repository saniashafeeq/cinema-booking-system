const bcrypt = require("bcryptjs")
//const db = require("../config/db")
const dotenv = require("dotenv")
const express = require("express")
const {Addshowtimes, Getshowtimes, Deleteshowtimes, Updateshowtimes} = require("../controllers/showtimesController")
const {verifyToken} = require("../middleware/authmiddleware")
const {checkRole} =require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")
const router = express.Router();

/**
 * @swagger
 * /api/showtimes/addShowtime:
 *   post:
 *     summary: Add a new showtime (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie_id
 *               - auditorium_id
 *               - ticket_price
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 example: 1
 *               auditorium_id:
 *                 type: integer
 *                 example: 1
 *               ticket_price:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Showtime added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Showtime added successfully
 *                 showtimeId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       500:
 *         description: Internal server error
 */
router.post('/addShowtime', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Addshowtimes)

/**
 * @swagger
 * /api/showtimes/getshowtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [Showtimes]
 *     responses:
 *       200:
 *         description: List of all showtimes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Showtime listed
 *                 showtimes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Showtime'
 *       500:
 *         description: Internal server error
 */
router.get('/getshowtimes', Getshowtimes);

/**
 * @swagger
 * /api/showtimes/deleteshowtime/{showtime_id}:
 *   delete:
 *     summary: Delete showtime by ID (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: showtime_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *       400:
 *         description: Invalid showtime ID
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteshowtime/:showtime_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Deleteshowtimes);

/**
 * @swagger
 * /api/showtimes/updateshowtime/{showtime_id}:
 *   put:
 *     summary: Update showtime by ID (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: showtime_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie_id:
 *                 type: integer
 *                 example: 2
 *               auditorium_id:
 *                 type: integer
 *                 example: 1
 *               ticket_price:
 *                 type: number
 *                 example: 600
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateshowtime/:showtime_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Updateshowtimes)


router.post('/addShowtime', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Addshowtimes)
router.get('/getshowtimes', Getshowtimes);
router.delete('/deleteshowtime/:showtime_id',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Deleteshowtimes);
router.put('/updateshowtime/:showtime_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), Updateshowtimes)

module.exports = router