const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


//reading env file
require('dotenv').config(); 
const PORT = process.env.PORT;

app.use(express.json());

// routes
const blogRoute = require('./routes/blogRoute');
const authRoute = require('./routes/authRoute');

// middleware
const authMiddleWare = (req, res, next) => {
    // Check the JWT token
    const secretKey = process.env.SECRET_KEY;
    const token = req.header('Authorization') || '';
    // console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const decode = jwt.decode(token, secretKey);
    console.log(decode);
    if (!decode) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    req.user = decode;
    next();
};

const errorMiddleware = (err, req, res, next) => {
	res.status(err.status).json({ error: true, message: err.message });
};

app.use('/blogs', authMiddleWare, blogRoute);
app.use('/auth', authRoute);
app.use(errorMiddleware);


// connection to local database
mongoose.connect('mongodb://localhost/task').then(()=> {
    app.listen(PORT, () => {
        console.log(`Express server is running in port ${PORT}`);
    })
}).catch((err) => {
    console.log(`Error connecting to DB`, err);
});
