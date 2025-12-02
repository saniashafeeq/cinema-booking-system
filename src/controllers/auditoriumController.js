const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require('../config/db')
const dotenv = require("dotenv")

const AddAuditorium = async (req, res) => {
    const { auditorium_name, total_seats } = req.body;

    if (!auditorium_name || !total_seats) {
        return res.status(400).json({ message: "Both auditorium_name and total_seats are required" });
    }

    try {
        const sql = "INSERT INTO auditoriums (auditorium_name, total_seats) VALUES (?, ?)";

        db.query(sql, [auditorium_name, total_seats], (error, results) => {
            if (error) {
                console.error("Error while adding the auditorium:", error);
                return res.status(500).json({ message: "Failed to add auditorium" });
            }

            return res.status(201).json({
                message: "Auditorium added successfully!",
                auditoriumId: results.insertId
            });
        });
    } catch (error) {
        console.error("Error while connecting to database:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const UpdateAuditorium = async (req, res) => {
    const { auditorium_id } = req.params;
    const { auditorium_name, total_seats } = req.body;

    // Check if at least one field is provided
    if (!auditorium_name && !total_seats) {
        return res.status(400).json({ message: "Please provide at least one field to update" });
    }

    try {
        let updates = [];
        let values = [];

        // Build the update statement dynamically
        if (auditorium_name) {
            updates.push("auditorium_name = ?");
            values.push(auditorium_name);
        }

        if (total_seats) {
            updates.push("total_seats = ?");
            values.push(total_seats);
        }

        // Add the auditorium_id to the values array (for the WHERE clause)
        const sql = `UPDATE auditoriums SET ${updates.join(", ")} WHERE auditorium_id = ?`;
        values.push(auditorium_id);  // Ensure the auditorium_id is in the query

        // Debug: Log the query to check it
        console.log("SQL Query: ", sql);
        console.log("Values: ", values);

        // Execute the query
        db.query(sql, values, (error, results) => {
            if (error) {
                console.error("Error updating the auditorium:", error);
                return res.status(500).json({ message: "Database update failed" });
            }

            // Check if any rows were updated
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Auditorium not found" });
            }

            // Return success message
            return res.status(200).json({ message: "Auditorium updated successfully" });
        });
    } catch (error) {
        console.error("Error updating the auditorium:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAudi = async(req, res)=>{

    try{
        const sql = "SELECT * FROM auditoriums"
        db.query(sql, (error, results)=>{
            if (error){
                console.error("Faield to get the auids")
                return res.status(400).json({message:"Failed to fetch"})
            }
            return res.status(200).json({message:"List of Audis:", audi:results})
        })

    }catch(error){
        console.error("Error while getting the data", error)
        return res.status(500).json({message:"Internal server Error"})
    }
};


const DeleteAudi = async(req, res)=>{
    const {auditorium_id} = req.params;

    try{
        const sql = "DELETE FROM auditoriums WHERE auditorium_id = ?"
        db.query(sql ,[auditorium_id], (error, results)=>{
            if (error){
                console.error("Error getting the audis",error)
                return res.status(400).json({message:"Failed to delete the Audi"})
            }
            return res.status(200).json({message:"Movie deleted successfully"})
        })

    }catch(error){
        console.error("Error while deleting the audi", error)
        return res.status(500).json({message:"Internal Server Error"})
    }
}



module.exports = {AddAuditorium, UpdateAuditorium, getAudi, DeleteAudi}