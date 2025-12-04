const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const express = require("express")
const {signup, login, getOwnProfile, updateOwnProfile, DeleteProfilebyAdmin, getAllCustomers} = require("../controllers/authController")
const {verifyToken} = require("../middleware/authmiddleware");
const {checkRole} = require("../middleware/roleMiddleware");
const {ROLES} = require("../constants/roles")

const router = express.Router();
/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - phoneNo
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phoneNo:
 *                 type: string
 *                 example: "03001234567"
 *               password:
 *                 type: string
 *                 example: password123
 *               role_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.post('/signup', signup)

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login Successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login)

/**
 * @swagger
 * /api/user/getOwnProfile/{user_id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/getOwnProfile/:user_id', getOwnProfile);

/**
 * @swagger
 * /api/user/updateOwnProfile/{user_id}:
 *   patch:
 *     summary: Update own profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch('/updateOwnProfile/:user_id', verifyToken, updateOwnProfile)

/**
 * @swagger
 * /api/user/DeleteProfilebyAdmin/{user_id}:
 *   delete:
 *     summary: Delete user profile (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/DeleteProfilebyAdmin/:user_id', verifyToken, checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteProfilebyAdmin)

/**
 * @swagger
 * /api/user/getAllCustomers:
 *   get:
 *     summary: Get all customers (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Access denied
 *       404:
 *         description: No customers found
 *       500:
 *         description: Internal server error
 */
router.get('/getAllCustomers', verifyToken, getAllCustomers)

router.post('/signup',signup)
router.post('/login', login)
router.get('/getOwnProfile/:user_id',getOwnProfile);
router.patch('/updateOwnProfile/:user_id', verifyToken, updateOwnProfile)
router.delete('/DeleteProfilebyAdmin/:user_id', verifyToken,checkRole(ROLES.SUPER_ADMIN, ROLES.ADMIN), DeleteProfilebyAdmin)
router.get('/getAllCustomers',verifyToken, getAllCustomers)
module.exports = router;