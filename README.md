<!-- # 🎬 Cinema Booking System Backend

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

## Loggers
Add Proper Logging with Winston. This will help with debugging, monitoring, and looks great in production!

## API Documentation with Swagger
Add professional, interactive API documentation. This will make project look super professional.

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
## Project Flow Idea
https://roadmap.sh/projects/movie-reservation-system -->






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
- 📚 **Interactive API Documentation (Swagger)**
- 📝 **Professional Logging System (Winston)**
- ⚙️ **Environment-based Configuration**

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt.js
- **Email Service**: Nodemailer
- **QR Code Generation**: qrcode
- **Validation**: express-validator
- **API Documentation**: Swagger UI Express
- **Logging**: Winston with Daily Rotate File
- **HTTP Logging**: Morgan

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
# Server Configuration
PORT=9000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=cinema_db

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:9000

# Logging
LOG_LEVEL=info
```

4. **Set up the database:**
- Create a MySQL database named `cinema_db`
- Import your database schema (if you have a SQL file)

5. **Start the server:**
```bash
npm start
```

Server will run on `http://localhost:9000`

## 📚 API Documentation (Swagger)

This project includes **interactive API documentation** powered by Swagger UI.

### Access Swagger UI:
Once the server is running, visit:
```
http://localhost:9000/api-docs
```

### Features:
- ✅ **Interactive testing** - Try all API endpoints directly from the browser
- ✅ **Authentication support** - Test protected routes with JWT tokens
- ✅ **Request/Response examples** - See exactly what data to send and expect
- ✅ **Schema validation** - View all data models and their requirements
- ✅ **Organized by tags** - Endpoints grouped by functionality

### How to Test Protected Endpoints:
1. Login via `/api/user/login` endpoint in Swagger
2. Copy the JWT token from the response
3. Click the **"Authorize" button** (🔒 icon at the top)
4. Enter: `Bearer YOUR_JWT_TOKEN`
5. Now you can test all protected endpoints!

### Swagger JSON:
Download the OpenAPI specification:
```
http://localhost:9000/api-docs.json
```

---

## 📝 Logging System (Winston)

This project uses **Winston** for professional logging with daily log rotation.

### Log Files Location:
```
cinema-booking-system/
├── logs/
│   ├── combined.log              # All logs
│   ├── error.log                 # Error logs only
│   └── application-YYYY-MM-DD.log # Daily rotating logs
```

### Log Levels:
- **error** - Critical errors (database failures, crashes)
- **warn** - Warning messages (invalid inputs, deprecated usage)
- **info** - Informational messages (user actions, server events)
- **http** - HTTP request logs
- **debug** - Debugging information (development only)

### Console Output (Development):
```bash
2024-01-15 10:30:45 [info]: 🚀 Server running on port 9000
2024-01-15 10:30:45 [info]: 📚 API Documentation available at http://localhost:9000/api-docs
2024-01-15 10:30:50 [info]: User logged in successfully { user_id: 1, username: 'john_doe' }
2024-01-15 10:31:00 [error]: Database query failed { error: 'Connection timeout' }
```

### Log Rotation:
- **Daily rotation** - New log file created each day
- **Automatic compression** - Old logs are zipped
- **14-day retention** - Logs older than 14 days are deleted
- **Size limit** - Each log file max 20MB

### Viewing Logs:
```bash
# View all logs
cat logs/combined.log

# View only errors
cat logs/error.log

# View today's logs
cat logs/application-$(date +%Y-%m-%d).log

# Monitor logs in real-time
tail -f logs/combined.log
```

---

## ⚙️ Environment Configuration

This project supports different configurations for different environments:

### Development Mode:
- Detailed error messages
- Console logging with colors
- Debug information visible
- Hot reload enabled

### Production Mode:
- Generic error messages for security
- File logging only (no console)
- Minimal debug information
- Optimized performance

### Setting Environment:
```bash
# Development (default)
NODE_ENV=development npm start

# Production
NODE_ENV=production npm start
```

---

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
| DELETE | `/deletereservation/:reservation_id` | Delete reservation | Yes (Admin) |
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

---

## 👥 User Roles

| Role | role_id | Permissions |
|------|---------|-------------|
| Super Admin | 1 | Full system access |
| Admin | 2 | Manage movies, genres, showtimes, auditoriums, seats, users |
| Customer | 3 | Book tickets, manage own profile, view movies |

---

## 📁 Project Structure
```
cinema-booking-system/
├── src/
│   ├── config/
│   │   ├── db.js                 # Database configuration
│   │   ├── emailConfig.js        # Email configuration
│   │   ├── logger.js             # Winston logger configuration
│   │   └── swagger.js            # Swagger/OpenAPI configuration
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
│   │   ├── roleMiddleware.js     # Role-based access control
│   │   └── loggerMiddleware.js   # Request logging
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
├── logs/                         # Log files (auto-generated)
│   ├── combined.log
│   ├── error.log
│   └── application-YYYY-MM-DD.log
├── uploads/                      # QR code tickets storage
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies
├── package-lock.json             # Locked dependencies
└── server.js                     # Entry point
```

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

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

**Response:**
```json
{
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role_id": 3
  }
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

---

## 🔧 Dependencies
```json
{
  "bcryptjs": "^2.4.3",
  "body-parser": "^1.20.2",
  "dotenv": "^16.4.7",
  "express": "^4.18.2",
  "express-validator": "^7.0.1",
  "jsonwebtoken": "^9.0.2",
  "morgan": "^1.10.0",
  "mysql": "^2.18.1",
  "nodemailer": "^6.9.16",
  "qrcode": "^1.5.4",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0",
  "winston": "^3.11.0",
  "winston-daily-rotate-file": "^4.7.1"
}
```

## 👨‍💻 Author

**Sania Shafeeq**
- GitHub: [@saniashafeeq](https://github.com/saniashafeeq)
- Project: [Cinema Booking System](https://github.com/saniashafeeq/cinema-booking-system)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/saniashafeeq/cinema-booking-system/issues).

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Introduction](https://jwt.io/introduction)
- [Swagger Documentation](https://swagger.io/docs/)
- [Winston Logger](https://github.com/winstonjs/winston)

---

## 🎓 Project Inspiration

Project idea from: [roadmap.sh - Movie Reservation System](https://roadmap.sh/projects/movie-reservation-system)

---

**Made by Sania Shafeeq**