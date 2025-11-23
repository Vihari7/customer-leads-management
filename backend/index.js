import express from "express";
import mongoose from "mongoose";  
import cors from "cors";
import leadsRoute from "./routes/leadsRoute.js"; 
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(cors());

// Leads Route Middleware
app.use('/leads', leadsRoute);


app.get('/', (request, response) => {
    console.log(request);
     return response.status(234).send('Welcome to Cuastomer Leads Management System');
});

const PORT = process.env.PORT || 5555;
const mongoDBURL = process.env.MONGO_DB_URL; 

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('Connected to Database');
        app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
    })
    .catch((error) => {
        console.error(error);
    });