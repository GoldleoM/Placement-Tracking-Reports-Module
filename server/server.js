const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// simple middleware
app.use(cors());
app.use(express.json());

// api routes
app.use('/api', apiRoutes);

// serve client files
app.use(express.static(path.join(__dirname, '..', 'client')));

// basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// connect db and start
const dbUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/placement_demo';

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log('Server running on port ' + PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
