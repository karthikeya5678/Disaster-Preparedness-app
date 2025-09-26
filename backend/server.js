// This MUST be the first line to ensure all other files can access environment variables.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// This is the "guest list" for your backend's security.
const whitelist = [
    'http://localhost:5173', // For your local development
    'https://karthikeya5678.github.io' // Your live GitHub Pages site
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions)); // Use the new, secure options

app.use(express.json());

// --- All API Routes ---
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/alerts', require('./src/routes/alerts'));
app.use('/api/drills', require('./src/routes/drills'));
app.use('/api/education', require('./src/routes/education'));
app.use('/api/contacts', require('./src/routes/contacts'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/progress', require('./src/routes/progress'));
app.use('/api/weather', require('./src/routes/weather'));
app.use('/api/emergency', require('./src/routes/emergency'));
app.use('/api/teacher', require('./src/routes/teacher'));

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});