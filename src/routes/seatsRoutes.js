const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const { AddSeats, GetSeats, DeleteSeats, UpdateSeats } = require("../controllers/seatsController")
const { verifyToken } = require("../middleware/authmiddleware")
const {checkRole} = require("../middleware/roleMiddleware")
const {ROLES} = require("../constants/roles")
const router = express.Router();

/**
 * @swagger
 * /api/seats/addseat:
 *   post:
 *     summary: Add a new seat (Admin only)
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auditorium_id
 *               - seat_number
 *               - is_vip
 *             properties:
 *               auditorium_id:
 *                 type: integer
 *                 example: 1
 *               seat_number:
 *                 type: string
 *                 example: A1
 *               is_vip:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Seat added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seat added successfully
 *                 seatId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       500:
 *         description: Internal server error
 */
router.post('/addseat', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), AddSeats)

/**
 * @swagger
 * /api/seats/getseats:
 *   get:
 *     summary: Get all seats
 *     tags: [Seats]
 *     responses:
 *       200:
 *         description: List of all seats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Getting seats Info
 *                 seats:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Seat'
 *       500:
 *         description: Internal server error
 */
router.get('/getseats', GetSeats);

/**
 * @swagger
 * /api/seats/deleteseats/{seat_id}:
 *   delete:
 *     summary: Delete seat by ID (Admin only)
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seat_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Seat deleted successfully
 *       400:
 *         description: Invalid seat ID
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteseats/:seat_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteSeats);

/**
 * @swagger
 * /api/seats/updateseat/{seat_id}:
 *   put:
 *     summary: Update seat by ID (Admin only)
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: seat_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Seat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auditorium_id:
 *                 type: integer
 *                 example: 1
 *               seat_number:
 *                 type: string
 *                 example: B5
 *               is_vip:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Seat updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateseat/:seat_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateSeats)

router.post('/addseat', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), AddSeats)
router.get('/getseats', GetSeats);
router.delete('/deleteseats/:seat_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteSeats);
router.put('/updateseat/:seat_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateSeats)

module.exports = router