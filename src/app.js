require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const schedulerService = require('./services/schedulerService');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api', apiRoutes);
schedulerService.startScheduler();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
