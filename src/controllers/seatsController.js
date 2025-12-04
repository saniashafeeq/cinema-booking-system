const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../config/db")
const dotenv = require("dotenv")

const AddSeats = async(req, res)=>{
    const {auditorium_id, seat_number, is_vip} = req.body;

     // ✅ Validation
     if (!auditorium_id || !seat_number || is_vip === undefined) {
        return res.status(400).json({
            message: "All fields are required: auditorium_id, seat_number, is_vip"
        });
    }

    try{
        const sql = "INSERT INTO seats (auditorium_id, seat_number, is_vip) VALUES (?,?,?)"
        db.query(sql,[auditorium_id, seat_number, is_vip],(error, results)=>{
            // Check if there's an error FIRST
            if(error){
                console.error("Error while adding the seats", error);
                return res.status(400).json({message:"Could not add more seats"})
            }
            
            // If no error, send success response
            return res.status(200).json({message:"Seat added successfully"})
        })

    }catch(error){
        console.error("Connecting to database", error)
        return res.status(500).json({message:"Internal server error"})
    }
}

const GetSeats = async(req, res)=>{
    try{
        const sql = "SELECT * FROM seats"
        db.query(sql, (error, results)=>{
            if (error){
                console.error("Error while getting the seats", error)
                return res.status(400).json("Could not get the seasts")
            }
            return res.status(200).json({message:"Getting seats Info:", seats:results})
        })
    }catch(error){
        console.error("Connesting to database...", error)
        return res.status(500).json({message:"Internal server error"})
    }
}


const DeleteSeats = async (req, res) => {
    const { seat_id } = req.params; // Get seat_id from URL parameter

    // ✅ Validation
    if (!seat_id || isNaN(seat_id)) {
        return res.status(400).json({ message: "Valid seat_id is required" });
    }

    try {
        const sql = "DELETE FROM seats WHERE seat_id = ?";
        db.query(sql, [seat_id], (error, results) => {
            if (error) {
                console.error("Error while deleting the seat", error);
                return res.status(400).json({ message: "Seat not found" });
            }

            // Check if any rows were affected (deleted)
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Seat not found" });
            }

            // If seat was deleted, send success message
            return res.status(200).json({ message: "Seat deleted successfully" });
        });
    } catch (error) {
        console.error("Error connecting to the database", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const UpdateSeats = async(req, res)=>{
    const { seat_id } = req.params;
    const {auditorium_id, seat_number, is_vip} = req.body;

    // ✅ Validation
    if (!seat_id || isNaN(seat_id)) {
        return res.status(400).json({ message: "Valid seat_id is required" });
    }

    if (!auditorium_id && !seat_number && is_vip === undefined) {
        return res.status(400).json({ 
            message: "At least one field is required to update" 
        });
    }

    try{
        let updates = [];
        let values = [];

        if (auditorium_id){
            updates.push("auditorium = ?")
            values.push(auditorium_id)
        }

        if (seat_number){
            updates.push("seat_number = ?")
            values.push(seat_number)
        }

        if (is_vip){
            updates.push("is_vip = ?")
            values.push(is_vip)
        }
        const sql = `UPDATE seats SET ${updates.join(",")} WHERE seat_id = ?`
        values.push(seat_id);

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating the seat:", err);
                return res.status(500).json({ message: "Database update failed!" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "seat not found" });
            }

            return res.status(200).json({ message: "seat updated successfully" });
        });

    }catch(error){
        console.error("Error while connecting to database", error)
        return res.status(500).json({message:"Internal Server Error"})
    }

}
module.exports = {AddSeats, GetSeats, DeleteSeats, UpdateSeats}