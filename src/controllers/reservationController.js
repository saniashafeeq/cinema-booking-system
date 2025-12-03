const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../config/db")
const qrcode = require("qrcode");
const fs = require("fs"); // File System module
const path = require("path"); // Path module



const AddReservation = async(req, res)=>{
    const {user_id, showtime_id, total_amount, status} = req.body;
    // ✅ Validation
    if (!user_id || !showtime_id || !total_amount || !status) {
        return res.status(400).json({
            message: "All fields are required: user_id, showtime_id, total_amount, status"
        });
    }

    if (typeof total_amount !== 'number' || total_amount <= 0) {
        return res.status(400).json({ 
            message: "total_amount must be a positive number" 
        });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Paid'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: `status must be one of: ${validStatuses.join(', ')}`
        });
    }


    try{
        const sql = "INSERT INTO reservations (user_id, showtime_id, total_amount, status ) VALUES (?,?,?,?)"
        db.query(sql, [user_id, showtime_id, total_amount, status], (error, results)=>{
            if (error){
                console.error("Error while adding the reservation", error)
                return res.status(400).json({message:"Could not add the reservation"})
            }
            return res.status(200).json({message:"Reservation added successfully"})
        })

    }catch(error){
        console.error("Error adding reservation", error)
        return res.status(500).json({message:"Internal Sever Error"})
    }
}

const GetReservation = async(req, res)=>{
    try {
        const sql = "SELECT * FROM reservations"
        db.query(sql, (error, results)=>{
            if (error){
                console.error("Error getting the reservation", error)
                return res.status(400).json({message:"Failed to get reservtions"})
            }
            return res.status(200).json({message:"Reservation Listed:", reservation:results})
        })

    }catch(error){
        console.error("Error while connecting to database", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}


const DeleteReservation = async(req, res)=>{
    const {reservation_id} = req.params;
    // ✅ Validation
    if (!reservation_id || isNaN(reservation_id)) {
        return res.status(400).json({ message: "Valid reservation_id is required" });
    }


    try{
        const sql = "DELECT * FROM reservations WHERE reservation_id =? "
        db.query(sql, [reservation_id],(error, results)=>{
            if (error){
                console.error("Error while deleting..", error)
                return res.status(400).json({message:"Failed to delete the reservations"})
            }
            return res.status(200).json({message:"Reservation deleted successfully"})
        })

    }catch(error){
        console.error("Error while connecting to database", error)
        return res.status(500).json({message:"Internal server Error"})
    }
}

const UpdateReservation = async(req, res)=>{
    const {reservation_id} = req.params

    const {user_id, showtime_id, total_amount, status} = req.body;

    if (!reservation_id || isNaN(reservation_id)) {
        return res.status(400).json({ message: "Valid reservation_id is required" });
    }

    if (!user_id && !showtime_id && !total_amount && !status) {
        return res.status(400).json({ 
            message: "At least one field is required to update" 
        });
    }

    if (total_amount && (typeof total_amount !== 'number' || total_amount <= 0)) {
        return res.status(400).json({ 
            message: "total_amount must be a positive number" 
        });
    }

    if (status) {
        const validStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Paid'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `status must be one of: ${validStatuses.join(', ')}`
            });
        }
    }

    try{
        let updates = [];
        let values = [];

        if (user_id){
            updates.push("user_id = ?")
            values.push(user_id)
        }

        if (showtime_id){
            updates.push("showtime_id = ?")
            values.push(showtime_id)
        }

        if (total_amount){
            updates.push("total_amount = ?")
            values.push(total_amount)
        }

        if (status){
            updates.push("status = ?")
            values.push(status)
        }

        const sql = `UPDATE reservations SET ${updates.join(",")} WHERE reservation_id = ?`
        values.push(reservation_id)
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating the reservation:", err);
                return res.status(500).json({ message: "Database update failed!" });
            }

            if (result.affectedRows === 0) {
                // If no rows are affected, it means the showtime_id wasn't found
                return res.status(404).json({ message: "reservation not found" });
            }

            // If everything is successful, send the success response
            return res.status(200).json({ message: "reservation updated successfully" });
        });


    }catch(error){
        console.error("Error connecting to dabase", error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

const GenerateQRCode = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        // Ensure the 'uploads' directory exists
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Fetch reservation details from the database
        const sql = `
            SELECT 
                r.reservation_id,
                r.booking_reference,
                r.total_amount,
                r.status,
                r.created_at,
                u.username as user_name,  -- Corrected from u.name to u.username
                u.email as user_email,
                m.title as movie_title,
                m.poster_url,
                m.duration_minutes,
                s.show_time,
                a.auditorium_name,
                GROUP_CONCAT(CONCAT(st.seat_number) ORDER BY st.seat_number SEPARATOR ', ') as seats
            FROM reservations r
            INNER JOIN users u ON r.user_id = u.user_id
            INNER JOIN showtimes s ON r.showtime_id = s.showtime_id
            INNER JOIN movies m ON s.movie_id = m.movie_id
            INNER JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
            LEFT JOIN reservation_seats rs ON r.reservation_id = rs.reservation_id
            LEFT JOIN seats st ON rs.seat_id = st.seat_id
            WHERE r.reservation_id = ?
            GROUP BY r.reservation_id
        `;
        
        db.query(sql, [reservation_id], (err, results) => {
            if (err) {
                console.error("Error fetching reservation data", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Reservation not found" });
            }

            const reservation = results[0];

            // Generate QR code data
            const qrData = `Reservation ID: ${reservation.reservation_id}, User: ${reservation.user_name}, Showtime: ${reservation.show_time}, Seats: ${reservation.seats}`;

            // Define path where QR code will be saved
            const qrFilePath = path.join(__dirname, `../uploads/qrcode_${reservation.reservation_id}.png`);
            
            // Generate the QR code and save it as a file
            qrcode.toFile(qrFilePath, qrData, (error) => {
                if (error) {
                    console.error("Error generating QR code", error);
                    return res.status(500).json({ message: "Error generating QR code" });
                }

                // Send the file path in the response
                return res.status(200).json({
                    message: "QR code generated",
                    qrCodeDownloadLink: `/uploads/qrcode_${reservation.reservation_id}.png`
                });
            });
        });
    } catch (error) {
        console.error("Error generating QR code", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {AddReservation, GetReservation, DeleteReservation, UpdateReservation, GenerateQRCode}






