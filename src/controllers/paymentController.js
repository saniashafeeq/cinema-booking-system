const { validationResult } = require('express-validator');
const db = require('../config/db');  

const processPayment = async (req, res) => {
    const { reservation_id } = req.params;
    const { user_id, amount, payment_method, transaction_id, payment_gateway, payment_reference } = req.body;

    try {
        // Validation of the payment request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Ensure the reservation exists
        const reservationQuery = "SELECT * FROM reservations WHERE reservation_id = ?";
        db.query(reservationQuery, [reservation_id], (err, result) => {
            if (err) {
                console.error("Error fetching reservation", err);
                return res.status(500).json({ message: "Error processing payment" });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Reservation not found" });
            }

            // Insert the payment into the payments table
            const paymentQuery = `
                INSERT INTO payments (reservation_id, user_id, amount, payment_method, payment_status, 
                                      payment_date, transaction_id, payment_reference, payment_gateway)
                VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)
            `;
            db.query(paymentQuery, [reservation_id, user_id, amount, payment_method, 'Success', transaction_id, payment_reference, payment_gateway], (err, paymentResult) => {
                if (err) {
                    console.error("Error inserting payment", err);
                    return res.status(500).json({ message: "Error processing payment" });
                }

                // Optionally update the reservation status (e.g., to "Paid")
                const updateReservationQuery = "UPDATE reservations SET status = 'Paid' WHERE reservation_id = ?";
                db.query(updateReservationQuery, [reservation_id], (err) => {
                    if (err) {
                        console.error("Error updating reservation status", err);
                    }

                    return res.status(200).json({ message: "Payment processed successfully" });
                });
            });
        });
    } catch (error) {
        console.error("Error processing payment", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { processPayment };
