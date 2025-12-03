const bcrypt = require("bcryptjs")
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")
const db = require("../config/db")

const Addshowtimes = async(req, res)=>{
    const {movie_id, auditorium_id, ticket_price} = req.body;

    // ✅ Add input validation
    if (!movie_id || !auditorium_id || !ticket_price) {
        return res.status(400).json({
            message: "All fields are required: movie_id, auditorium_id, ticket_price"
        });
    }

    if (typeof ticket_price !== 'number' || ticket_price <= 0) {
        return res.status(400).json({ 
            message: "ticket_price must be a positive number" 
        });
    }


    try {
        const sql = "INSERT INTO showtimes (movie_id, auditorium_id, ticket_price) VALUES (?,?,?)"
        db.query(sql, [movie_id, auditorium_id, ticket_price], (error, results)=>{
            if (error){
                console.error("Error while adding showtimes", error)
            return res.status(400).json({message:"Failed to add"})
            }
            return res.status(200).json({message:"Showtime added successfully"})
        })
       
    }catch(error){
        console.error("Error whhile connecting to database", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

const Getshowtimes = async (req, res) => {
    try {
        const sql = "SELECT * FROM showtimes";
        
        db.query(sql, (error, results) => {
            if (error) {
                console.error("Error while getting the showtimes", error);
                return res.status(400).json({ message: "Fail to get the showtimes" });
            }
            return res.status(200).json({ message: "Show time listed", showtimes: results });
        });
    } catch (error) {
        console.error("Error connecting to database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const Deleteshowtimes = async (req, res) => {
    const { showtime_id } = req.params;

        // ✅ Validation
        if (!showtime_id || isNaN(showtime_id)) {
            return res.status(400).json({ message: "Valid showtime_id is required" });
        }
    

    try {
        const sql = "DELETE FROM showtimes WHERE showtime_id = ?";
        db.query(sql, [showtime_id], (error, results) => {
            if (error) {
                console.error("Error while deleting the showtimes", error);
                return res.status(400).json({ message: "Failed to delete the showtimes" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Showtime not found" });
            }
            return res.status(200).json({ message: "Showtime deleted successfully" });
        });
    } catch (error) {
        console.error("Error while connecting to database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const Updateshowtimes = async (req, res) => {
    const { showtime_id } = req.params;
    const { movie_id, auditorium_id, ticket_price } = req.body;

    // ✅ Validation
    if (!showtime_id || isNaN(showtime_id)) {
        return res.status(400).json({ message: "Valid showtime_id is required" });
    }

    if (!movie_id && !auditorium_id && !ticket_price) {
        return res.status(400).json({ 
            message: "At least one field is required to update" 
        });
    }

    if (ticket_price && (typeof ticket_price !== 'number' || ticket_price <= 0)) {
        return res.status(400).json({ 
            message: "ticket_price must be a positive number" 
        });
    }

    try {
        let updates = [];
        let values = [];

        if (movie_id) {
            updates.push("movie_id = ?");
            values.push(movie_id);
        }

        if (auditorium_id) {
            updates.push("auditorium_id = ?");
            values.push(auditorium_id);
        }

        if (ticket_price) {
            updates.push("ticket_price = ?");
            values.push(ticket_price);
        }

        const sql = `UPDATE showtimes SET ${updates.join(",")} WHERE showtime_id = ?`;
        values.push(showtime_id);

        // Run the query and ensure response is inside the callback
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating the showtimes:", err);
                return res.status(500).json({ message: "Database update failed!" });
            }

            if (result.affectedRows === 0) {
                // If no rows are affected, it means the showtime_id wasn't found
                return res.status(404).json({ message: "Showtime not found" });
            }

            // If everything is successful, send the success response
            return res.status(200).json({ message: "Showtime updated successfully" });
        });
    } catch (error) {
        // This catch block will only handle errors not related to the query itself
        console.error("Error while connecting to the database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {Addshowtimes, Getshowtimes, Deleteshowtimes, Updateshowtimes}