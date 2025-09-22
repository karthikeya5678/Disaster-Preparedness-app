// This MUST be the first line to ensure all other files can access environment variables.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');
const { db } = require('./src/config/firebase');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Disaster Preparedness API is running smoothly.',
        status: 'OK'
    });
});

// --- Route Registration ---
app.use('/api/users', require('./src/routes/users')); 
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/alerts', require('./src/routes/alerts'));
app.use('/api/drills', require('./src/routes/drills'));
app.use('/api/education', require('./src/routes/education'));
app.use('/api/contacts', require('./src/routes/contacts'));
app.use('/api/dashboard', require('./src/routes/dashboard'));
app.use('/api/progress', require('./src/routes/progress'));
// This line is now correctly enabled
app.use('/api/weather', require('./src/routes/weather'));
app.use('/api/emergency', require('./src/routes/emergency'));
app.use('/api/teacher', require('./src/routes/teacher'));

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});