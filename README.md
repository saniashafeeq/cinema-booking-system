# 🎬 Cinema Booking System Backend

A comprehensive RESTful API for managing cinema bookings, built with Node.js, Express, and MySQL.

## ✨ Features

- 🔐 User Authentication (JWT-based)
- 👥 Role-based Access Control (Super Admin, Admin, Customer)
- 🎬 Movie Management
- 🎭 Genre Management
- 🏛️ Auditorium Management
- 💺 Seat Management
- ⏰ Showtime Scheduling
- 📝 Reservation System
- 💳 Payment Processing
- 🎫 QR Code Ticket Generation
- 🔄 Password Reset via Email

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt.js
- **Email Service**: Nodemailer
- **QR Code Generation**: qrcode
- **Validation**: express-validator

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/saniashafeeq/cinema-booking-system.git
cd cinema-booking-system
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:
```env
# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=cinema_db

# Email Configuration
EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:9000

# Server Port
PORT=9000
```

4. **Set up the database:**
- Create a MySQL database named `cinema_db`
- Import your database schema (if you have a SQL file)

5. **Start the server:**
```bash
npm start
```

Server will run on `http://localhost:9000`

## 🚀 API Endpoints

### Authentication Routes (`/api/user`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/getOwnProfile/:user_id` | Get user profile | No |
| PATCH | `/updateOwnProfile/:user_id` | Update own profile | Yes |
| DELETE | `/DeleteProfilebyAdmin/:user_id` | Delete user (Admin) | Yes (Admin) |
| GET | `/getAllCustomers` | Get all customers | Yes (Admin) |

### Movie Routes (`/api/movies`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Add new movie | Yes (Admin) |
| GET | `/getallmovie` | Get all movies | No |
| GET | `/getmoviebyid/:movie_id` | Get movie by ID | No |
| PUT | `/updatemovie/:movie_id` | Update movie | Yes (Admin) |
| DELETE | `/deletemovie/:movie_id` | Delete movie | Yes (Admin) |

### Genre Routes (`/api/genres`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/createGenre` | Create genre | Yes (Admin) |
| GET | `/getgenres` | Get all genres | No |
| PUT | `/update/:genre_id` | Update genre | Yes (Admin) |
| DELETE | `/delete/:genre_id` | Delete genre | Yes (Admin) |

### Auditorium Routes (`/api/auditorium`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/addaudi` | Add auditorium | Yes (Admin) |
| GET | `/getAudi` | Get all auditoriums | No |
| PUT | `/updateaudi/:auditorium_id` | Update auditorium | Yes (Admin) |
| DELETE | `/deleteAudi/:auditorium_id` | Delete auditorium | Yes (Admin) |

### Seat Routes (`/api/seats`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/addseat` | Add seat | Yes (Admin) |
| GET | `/getseats` | Get all seats | No |
| PUT | `/updateseat/:seat_id` | Update seat | Yes (Admin) |
| DELETE | `/deleteseats/:seat_id` | Delete seat | Yes (Admin) |

### Showtime Routes (`/api/showtimes`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/addShowtime` | Add showtime | Yes (Admin) |
| GET | `/getshowtimes` | Get all showtimes | No |
| PUT | `/updateshowtime/:showtime_id` | Update showtime | Yes (Admin) |
| DELETE | `/deleteshowtime/:showtime_id` | Delete showtime | Yes (Admin) |

### Reservation Routes (`/api/reservation`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/addreservation` | Create reservation | Yes |
| GET | `/getreservation` | Get all reservations | No |
| PUT | `/updatereservation/:reservation_id` | Update reservation | Yes (Admin) |
| DELETE | `/deletereservation` | Delete reservation | Yes (Admin) |
| GET | `/:reservation_id/ticket` | Generate QR code ticket | No |

### Payment Routes (`/api`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reservations/:reservation_id/payment` | Process payment | Yes |

### Password Reset Routes (`/api/password`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |

## 👥 User Roles

| Role | role_id | Permissions |
|------|---------|-------------|
| Super Admin | 1 | Full system access |
| Admin | 2 | Manage movies, genres, showtimes, auditoriums, seats, users |
| Customer | 3 | Book tickets, manage own profile, view movies |

## 📁 Project Structure
```
cinema-booking-system/
├── src/
│   ├── config/
│   │   ├── db.js                 # Database configuration
│   │   └── emailConfig.js        # Email configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── genresController.js
│   │   ├── auditoriumController.js
│   │   ├── seatsController.js
│   │   ├── showtimesController.js
│   │   ├── reservationController.js
│   │   ├── paymentController.js
│   │   └── passwordResetController.js
│   ├── middleware/
│   │   ├── authmiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role-based access control
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── genresRoutes.js
│   │   ├── auditoriumRoutes.js
│   │   ├── seatsRoutes.js
│   │   ├── showtimesRoutes.js
│   │   ├── reservationRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── passwordResetRoutes.js
│   └── constants/
│       └── roles.js              # Role constants
├── uploads/                      # QR code tickets storage
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies
├── package-lock.json             # Locked dependencies
└── server.js                     # Entry point
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Example API Usage

### Register a new user:
```bash
POST /api/user/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "phoneNo": "03001234567",
  "password": "securePassword123"
}
```

### Login:
```bash
POST /api/user/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

### Add a movie (Admin only):
```bash
POST /api/movies
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Inception",
  "description": "A mind-bending thriller",
  "poster_url": "https://example.com/poster.jpg",
  "genre_id": 1,
  "duration_minutes": 148
}
```

## 🔧 Dependencies
```json
{
  "bcryptjs": "^2.4.3",
  "body-parser": "^1.20.2",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-validator": "^7.0.1",
  "jsonwebtoken": "^9.0.2",
  "mysql": "^2.18.1",
  "nodemailer": "^6.9.7",
  "qrcode": "^1.5.3"
}
```

## 🐛 Known Issues

- Password reset token should be hashed before storing (security enhancement needed)
- Seat availability checking needs to be implemented before reservation
- Transaction support needed for reservation + seat assignment

## 🚀 Future Enhancements

- [ ] Add seat availability real-time checking
- [ ] Implement transaction support for reservations
- [ ] Add pagination to all list endpoints
- [ ] Add rate limiting for API security
- [ ] Implement caching for frequently accessed data
- [ ] Add comprehensive input validation
- [ ] Create automated tests
- [ ] Add API documentation with Swagger
- [ ] Implement email notifications for bookings
- [ ] Add booking cancellation feature

## 👨‍💻 Author

**Sania Shafeeq**
- GitHub: [@saniashafeeq](https://github.com/saniashafeeq)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/saniashafeeq/cinema-booking-system/issues).

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---
## Project URL
[GitHub Repository](https://github.com/saniashafeeq/cinema-booking-system)
https://roadmap.sh/projects/movie-reservation-system

Made by Sania Shafeeq