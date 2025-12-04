const express = require("express");
const bodyParser = require("body-parser");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


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

app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})
