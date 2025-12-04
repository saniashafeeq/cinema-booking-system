const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const express = require("express")
const {AddReservation, GetReservation, DeleteReservation, UpdateReservation, GenerateQRCode} = require("../controllers/reservationController")
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")

const router = express.Router();

/**
 * @swagger
 * /api/reservation/addreservation:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - showtime_id
 *               - total_amount
 *               - status
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               showtime_id:
 *                 type: integer
 *                 example: 1
 *               total_amount:
 *                 type: number
 *                 example: 1000
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Cancelled, Paid]
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Reservation added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reservation added successfully
 *                 reservationId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/addreservation', AddReservation);

/**
 * @swagger
 * /api/reservation/getreservation:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reservation Listed
 *                 reservation:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Internal server error
 */
router.get('/getreservation', GetReservation);

/**
 * @swagger
 * /api/reservation/deletereservation/{reservation_id}:
 *   delete:
 *     summary: Delete reservation by ID (Admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       400:
 *         description: Invalid reservation ID
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deletereservation/:reservation_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteReservation)

/**
 * @swagger
 * /api/reservation/updatereservation/{reservation_id}:
 *   put:
 *     summary: Update reservation by ID (Admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               showtime_id:
 *                 type: integer
 *                 example: 2
 *               total_amount:
 *                 type: number
 *                 example: 1500
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Cancelled, Paid]
 *                 example: Confirmed
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
router.put('/updatereservation/:reservation_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateReservation)

/**
 * @swagger
 * /api/reservation/{reservation_id}/ticket:
 *   get:
 *     summary: Generate QR code ticket for reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: QR code generated
 *                 qrCodeDownloadLink:
 *                   type: string
 *                   example: /uploads/qrcode_1.png
 *       400:
 *         description: Invalid reservation ID
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
router.get('/:reservation_id/ticket', GenerateQRCode);

router.post('/addreservation', AddReservation);
router.get('/getreservation', GetReservation);
router.delete('/deletereservation', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteReservation)
router.put('/updatereservation/:reservation_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateReservation)
router.get('/:reservation_id/ticket', GenerateQRCode);  // Handles GET request to generate QR code

module.exports = router;