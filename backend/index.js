require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Add this line
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
