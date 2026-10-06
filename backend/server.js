const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));


// Ensure every request gets a clean 503 when the database is unavailable.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database unavailable:', error.message);
        res.status(503).json({ success: false, message: 'Database unavailable' });
    }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointment', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// Only listen if running directly (dev/local), not when imported by Vercel
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        connectDB().catch((error) => {
            console.error('Initial MongoDB connection failed; API requests will retry:', error.message);
        });
    });
}

module.exports = app;
