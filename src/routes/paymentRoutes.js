const express = require('express');
const { check } = require('express-validator');
const { processPayment } = require('../controllers/paymentController');
const router = express.Router();
router.post('/reservations/:reservation_id/payment', [
    check('amount').isNumeric().withMessage('Amount must be a number'),
    check('payment_method').notEmpty().withMessage('Payment method is required'),
    check('transaction_id').notEmpty().withMessage('Transaction ID is required')
], processPayment);
module.exports = router;
