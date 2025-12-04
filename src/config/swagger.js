const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cinema Booking System API',
            version: '1.0.0',
            description: 'A comprehensive RESTful API for managing cinema bookings with user authentication, movie management, and reservation features',
            contact: {
                name: 'Sania Shafeeq',
                email: 'your.email@example.com',
                url: 'https://github.com/saniashafeeq/cinema-booking-system'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:9000',
                description: 'Development server'
            },
            {
                url: 'https://your-production-url.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        user_id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        phoneNo: { type: 'string', example: '03001234567' },
                        role_id: { type: 'integer', example: 3 },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Movie: {
                    type: 'object',
                    properties: {
                        movie_id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Inception' },
                        description: { type: 'string', example: 'A mind-bending thriller' },
                        poster_url: { type: 'string', example: 'https://example.com/poster.jpg' },
                        genre_id: { type: 'integer', example: 1 },
                        duration_minutes: { type: 'integer', example: 148 },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Genre: {
                    type: 'object',
                    properties: {
                        genre_id: { type: 'integer', example: 1 },
                        genre_name: { type: 'string', example: 'Action' },
                        description: { type: 'string', example: 'Action movies' }
                    }
                },
                Auditorium: {
                    type: 'object',
                    properties: {
                        auditorium_id: { type: 'integer', example: 1 },
                        auditorium_name: { type: 'string', example: 'Hall A' },
                        total_seats: { type: 'integer', example: 150 }
                    }
                },
                Seat: {
                    type: 'object',
                    properties: {
                        seat_id: { type: 'integer', example: 1 },
                        auditorium_id: { type: 'integer', example: 1 },
                        seat_number: { type: 'string', example: 'A1' },
                        is_vip: { type: 'boolean', example: false }
                    }
                },
                Showtime: {
                    type: 'object',
                    properties: {
                        showtime_id: { type: 'integer', example: 1 },
                        movie_id: { type: 'integer', example: 1 },
                        auditorium_id: { type: 'integer', example: 1 },
                        show_time: { type: 'string', format: 'date-time' },
                        ticket_price: { type: 'number', example: 500 }
                    }
                },
                Reservation: {
                    type: 'object',
                    properties: {
                        reservation_id: { type: 'integer', example: 1 },
                        user_id: { type: 'integer', example: 1 },
                        showtime_id: { type: 'integer', example: 1 },
                        total_amount: { type: 'number', example: 1000 },
                        status: { type: 'string', enum: ['Pending', 'Confirmed', 'Cancelled', 'Paid'], example: 'Pending' },
                        booking_reference: { type: 'string', example: 'BK-123456' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Error message' }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Operation successful' }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints'
            },
            {
                name: 'Movies',
                description: 'Movie management endpoints'
            },
            {
                name: 'Genres',
                description: 'Genre management endpoints'
            },
            {
                name: 'Auditoriums',
                description: 'Auditorium management endpoints'
            },
            {
                name: 'Seats',
                description: 'Seat management endpoints'
            },
            {
                name: 'Showtimes',
                description: 'Showtime management endpoints'
            },
            {
                name: 'Reservations',
                description: 'Reservation management endpoints'
            },
            {
                name: 'Payments',
                description: 'Payment processing endpoints'
            },
            {
                name: 'Password Reset',
                description: 'Password reset endpoints'
            }
        ]
    },
    apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;