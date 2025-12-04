const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan'); // ✅ ADD THIS
const logger = require('../cinema_booking_sys/src/config/logger')
const swaggerUi = require('swagger-ui-express'); // ✅ ADD THIS
const swaggerSpec = require('../cinema_booking_sys/src/config/swagger'); // ✅ ADD THIS
const authRoutes = require("../cinema_booking_sys/src/routes/authRoutes");
const genresRoutes = require("../cinema_booking_sys/src/routes/genresRoutes")
const movieRoutes = require("../cinema_booking_sys/src/routes/movieRoutes");
const auditoriumRoutes = require("../cinema_booking_sys/src/routes/auditoriumRoutes");
const seatsRoutes = require("../cinema_booking_sys/src/routes/seatsRoutes");
const showtimesRoutes = require("../cinema_booking_sys/src/routes/showtimesRoutes");
const reservationRoutes = require("../cinema_booking_sys/src/routes/reservationRoutes")
const passwordResetRoutes = require("../cinema_booking_sys/src/routes/passwordResetRoutes")
const paymentRoutes = require('../cinema_booking_sys/src/routes/paymentRoutes');  // Import the payment routes
const path = require("path");
const app = express();
const port = 9000


// ✅ ADD THIS - HTTP request logging
// Custom token for response time
morgan.token('response-time-ms', (req, res) => {
    const responseTime = res.getHeader('X-Response-Time');
    return responseTime ? `${responseTime}ms` : 'N/A';
});

// Use morgan with winston
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: logger.stream
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// ✅ ADD THIS - Log unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
});

// ✅ ADD THIS - Log uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1); // Exit the process
});

// ✅ ADD THIS - Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Cinema Booking API Docs'
}));

// ✅ ADD THIS - Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// ✅ ADD THIS - Health check with logging
app.get('/health', (req, res) => {
    logger.info('Health check requested');
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/api/user',authRoutes);
app.use('/api/genres',genresRoutes)
app.use('/api/movies',movieRoutes)
app.use('/api/auditorium',auditoriumRoutes)
app.use('/api/seats',seatsRoutes);
app.use('/api/showtimes',showtimesRoutes);
app.use('/api/reservation', reservationRoutes)
app.use("/api/password", passwordResetRoutes); // ✅ ADD THIS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api', paymentRoutes);

// app.listen(port, ()=>{
//     console.log(`server running on port ${port}`)
// })
// ✅ ADD THIS - 404 handler
app.use((req, res) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        message: 'Route not found',
        path: req.url
    });
});

// ✅ ADD THIS - Global error handler
app.use((err, req, res, next) => {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
    
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

app.listen(port, () => {
    logger.info(`🚀 Server running on port ${port}`);
    logger.info(`📚 API Documentation available at http://localhost:${port}/api-docs`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
})