const express = require('express');
const { check } = require('express-validator');
const { processPayment } = require('../controllers/paymentController');
const router = express.Router();

/**
 * @swagger
 * /api/reservations/{reservation_id}/payment:
 *   post:
 *     summary: Process payment for a reservation
 *     tags: [Payments]
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
 *             required:
 *               - user_id
 *               - amount
 *               - payment_method
 *               - transaction_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 1000
 *               payment_method:
 *                 type: string
 *                 example: Credit Card
 *               transaction_id:
 *                 type: string
 *                 example: TXN123456789
 *               payment_gateway:
 *                 type: string
 *                 example: Stripe
 *               payment_reference:
 *                 type: string
 *                 example: REF123456
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment processed successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */


router.post('/reservations/:reservation_id/payment', [
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('payment_method').notEmpty().withMessage('Payment method is required'),
    check('transaction_id').notEmpty().withMessage('Transaction ID is required')
], processPayment);
module.exports = router;
