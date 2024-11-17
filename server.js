// connecting to database mongodb

// require('dotenv').config({ path: './config.env' }); // Load .env variables

// const { MongoClient } = require('mongodb');

// // Connection URL
// const url = process.env.URL; // Default MongoDB URL
// const dbName = process.env.DBNAME; // Replace with your database name

// async function connectToMongoDB() {
//     const client = new MongoClient(url);

//     try {
//         // Connect to the MongoDB server
//         await client.connect();
//         console.log('Connected successfully to MongoDB');

//         // Access the database
//         const db = client.db(dbName);

//         // Example: Access a collection and insert a document
//         const collection = db.collection(process.env.DBCOLLECTION);
//         const result = await collection.insertOne({ name: 'Ali Dalla', age: 29 });
//         console.log('Document inserted:', result.insertedId);
//     } catch (err) {
//         console.error('Error connecting to MongoDB:', err);
//     } finally {
//         // Close the connection
//         await client.close();
//         console.log('Connection closed');
//     }
// }

// connectToMongoDB();



const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: 'config.env' });
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');


// Connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories', categoryRoute);

app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});


// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

