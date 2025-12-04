const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {AddAuditorium, UpdateAuditorium, getAudi, DeleteAudi} = require("../controllers/auditoriumController");
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")

const router = express.Router();

/**
 * @swagger
 * /api/auditorium/addaudi:
 *   post:
 *     summary: Add a new auditorium (Admin only)
 *     tags: [Auditoriums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auditorium_name
 *               - total_seats
 *             properties:
 *               auditorium_name:
 *                 type: string
 *                 example: Hall A
 *               total_seats:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       201:
 *         description: Auditorium added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Auditorium added successfully!
 *                 auditoriumId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       500:
 *         description: Internal server error
 */
router.post('/addaudi', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), AddAuditorium);

/**
 * @swagger
 * /api/auditorium/updateaudi/{auditorium_id}:
 *   put:
 *     summary: Update auditorium by ID (Admin only)
 *     tags: [Auditoriums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auditorium_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Auditorium ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auditorium_name:
 *                 type: string
 *                 example: Hall B
 *               total_seats:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       200:
 *         description: Auditorium updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Auditorium not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateaudi/:auditorium_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateAuditorium);

/**
 * @swagger
 * /api/auditorium/getAudi:
 *   get:
 *     summary: Get all auditoriums
 *     tags: [Auditoriums]
 *     responses:
 *       200:
 *         description: List of all auditoriums
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List of Auditoriums
 *                 audi:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Auditorium'
 *       500:
 *         description: Internal server error
 */
router.get('/getAudi', getAudi);

/**
 * @swagger
 * /api/auditorium/deleteAudi/{auditorium_id}:
 *   delete:
 *     summary: Delete auditorium by ID (Admin only)
 *     tags: [Auditoriums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auditorium_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Auditorium ID
 *     responses:
 *       200:
 *         description: Auditorium deleted successfully
 *       400:
 *         description: Invalid auditorium ID
 *       403:
 *         description: Access denied - Admin only
 *       404:
 *         description: Auditorium not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteAudi/:auditorium_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteAudi)

router.post('/addaudi',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), AddAuditorium);
router.put('/updateaudi/:auditorium_id',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), UpdateAuditorium);
router.get('/getAudi',getAudi);
router.delete('/deleteAudi/:auditorium_id',verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteAudi)
module.exports = router