const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require('../config/db')

const createGenre = async(req, res)=>{
    const {role_id} = req.user;
    console.log("User Role ID from Token:", role_id);  // Add this line for debugging
    if (role_id !== 2){
        return res.status(403).json({message:"Access denied!Only Admin can only perform this action"})
    }

    const {genre_name, description} = req.body;

    if (!genre_name || !description){
        return res.status(400).json({message:"Provide genre_name and description for the movie"})
    }

    try{
        const sql = "INSERT into genres (genre_name, description) VALUES (?,?)"
        db.query(sql,[genre_name,description], (error, results)=>{
            if (error){
                console.error("Error while creating genre:", error);
        return res.status(500).json({ message: "Database insert failed!" });
            }
            return res.status(201).json({message:"Genre Created successfully", genre: {
                id: results.insertId,
                genre_name,
                description
              },
            })
        });
    }catch(error){
        console.error("Movie adding failed", error);
        return res.status(500).json({message:"Internal server error"})
    }

}


const getGenres = async (req, res) => {
    try {
      const sql = "SELECT * FROM genres"; 
      db.query(sql, (error, results) => {
        if (error) {
          console.error("Error while fetching the results", error);
          return res.status(500).json({ message: "Unable to load the genres" });
        }
        return res.status(200).json({
          message: "All genres fetched successfully",
          genres: results,
        });
      });
    } catch (error) {
      console.error("Error getting the genres", error);
      return res.status(500).json({ message: "Internal server error" });
    }
};
  

const updateGenre = async (req, res) => {
  const { genre_id } = req.params;
  const { genre_name, description } = req.body;

  try {
    let updates = [];
    let values = [];

    if (genre_name) {
      updates.push("genre_name = ?");
      values.push(genre_name);
    }

    if (description) {
      updates.push("description = ?");
      values.push(description);
    }

    const sql = `UPDATE genres SET ${updates.join(", ")} WHERE genre_id = ?`;
    values.push(genre_id);

    db.query(sql, values, (error, results) => {
      if (error) {
        console.error("Error while updating genre:", error);
        return res.status(500).json({ message: "Database update failed!" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Genre not found!" });
      }

      return res.status(200).json({
        message: "Genre updated successfully!",
        genres: results,
      });
    });
  } catch (error) {
    console.error("Error while updating genre:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const deleteGenre = async (req, res) => {
    const { genre_id } = req.params; // Get genre_id from URL params

    if (!genre_id) {
        return res.status(400).json({ message: "Genre ID is required!" });
    }

    try {
        const sql = "DELETE FROM genres WHERE genre_id = ?";
        db.query(sql, [genre_id], (error, results) => {
            if (error) {
                console.error("Error while deleting the genre:", error);
                return res.status(500).json({ message: "Unable to delete the genre" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Genre not found!" });
            }

            return res.status(200).json({ message: "Genre deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting the genre:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {createGenre, getGenres, updateGenre,deleteGenre}