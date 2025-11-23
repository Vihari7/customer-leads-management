import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";   

const app = express();

app.get('/', (req, res) => {
    console.log(req);
    res.send('Hello World!');
});

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