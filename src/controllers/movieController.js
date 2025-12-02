const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const db = require("../config/db");

const addMovie = async (req, res) => {
    const { title, description, poster_url, genre_id, duration_minutes } = req.body;

    if (!title || !description || !poster_url || !genre_id || !duration_minutes) {
        return res.status(400).json({ message: "All fields are required: title, description, poster_url, genre_id, duration_minutes" });
    }

    try {
        const genreCheckQuery = "SELECT genre_id FROM genres WHERE genre_id = ?";
        db.query(genreCheckQuery, [genre_id], (error, results) => {
            if (error) {
                console.error("Error checking genre:", error);
                return res.status(500).json({ message: "Error checking genre" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Genre not found" });
            }

            const sql = "INSERT INTO movies (title, description, poster_url, genre_id, duration_minutes, created_at) VALUES (?,?,?,?,?, NOW())";
            db.query(sql, [title, description, poster_url, genre_id, duration_minutes], (error, results) => {
                if (error) {
                    console.error("Error adding the movie:", error);
                    return res.status(500).json({ message: "Error adding movie" });
                }

                return res.status(201).json({ message: "Movie added successfully", movieId: results.insertId });
            });
        });
    } catch (error) {
        console.error("Error while adding the movie:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// const getallMovie = async(req, res)=>{
//     try{
//         const sql = "SELECT * FROM movies"
//         db.query(sql,(error, results)=>{
//             if (error){
//                 console.error("Error getting the movies", error)
//                 return res.status(400).json({message:"Failed to fetch"})
//             }
//             return res.status(200).json({message:"List of movies:",movie:results})
//         })

//     }catch(error){
//         console.error("Error while getting the movie",error)
//         return res.status(500).json({message:"Internal Server Error"})
//     }
// }
const getallMovie = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    try {
        // Get total count
        db.query("SELECT COUNT(*) as total FROM movies", (err, countResult) => {
            if (err) return res.status(500).json({ message: "Database error" });
            
            const total = countResult[0].total;
            
            // Get paginated results
            const sql = "SELECT * FROM movies LIMIT ? OFFSET ?";
            db.query(sql, [limit, offset], (error, results) => {
                if (error) {
                    return res.status(500).json({ message: "Failed to fetch" });
                }
                
                return res.status(200).json({
                    message: "List of movies",
                    movies: results,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit)
                    }
                });
            });
        });
    } catch(error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


const getMovieById = async(req, res)=>{
    const { movie_id } = req.params;  

    try{
        const sql = "SELECT * FROM movies WHERE movie_id = ?";
        db.query(sql, [movie_id],(error, results)=>{
            if (error){
                console.error("Error getting the moie")
                return res.status(500).json({ message: "Error fetching movie details" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "Movie not found" });
            }
            return res.status(200).json({ message: "Details of the movie", movie: results[0] });
        })

    }catch(error){
        console.error("Error while geeting the movie",error)
        return res.status(500).json({message:"Internal Server Error"})

    }
}

const updateMovieById = async (req, res) => {
    const {movie_id} = req.params;
    const { title, description, poster_url, genre_id, duration_minutes } = req.body;

    try {
        let updates = [];
        let values = [];

        if (title) {
            updates.push("title = ?");
            values.push(title);
        }
        if (description) {
            updates.push("description = ?");
            values.push(description);
        }
        if (poster_url) {
            updates.push("poster_url = ?");
            values.push(poster_url);
        }
        if (genre_id) {
            updates.push("genre_id = ?");
            values.push(genre_id);
        }
        if (duration_minutes) {
            updates.push("duration_minutes = ?");
            values.push(duration_minutes);
        }

        const sql = `UPDATE movies SET ${updates.join(", ")} WHERE movie_id = ?`;
        values.push(movie_id); 

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error updating the movie:", err);
                return res.status(500).json({ message: "Database update failed!" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Movie not found" });
            }

            return res.status(200).json({ message: "Movie updated successfully" });
        });
    } catch (error) {
        console.error("Error updating the movie:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteMovieById = async (req, res) => {
    const { movie_id } = req.params;  // Get movie_id from request params

    try {
        const sql = "DELETE FROM movies WHERE movie_id = ?";

        db.query(sql, [movie_id], (error, results) => {
            if (error) {
                console.error("Error deleting the movie", error);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Movie not found" });
            }

            return res.status(200).json({ message: "Movie deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting the movie", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {addMovie,getallMovie, getMovieById, updateMovieById, deleteMovieById}