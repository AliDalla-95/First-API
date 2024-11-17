require('dotenv').config({ path: '../config.env'});
//dotenv.config({ path: '../config.env' });


const mongoose = require('mongoose');


// config/database.js
const connectDB = async () => {
  try {
    // Removed the deprecated options
    await mongoose.connect(process.env.URL + '/' + process.env.DBNAME);
    console.log(`MongoDB connected to database: ${process.env.DBNAME}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = connectDB;