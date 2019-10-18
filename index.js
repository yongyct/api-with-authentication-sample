// Base libraries
const util = require('util')
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

// App modules
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Connection & Config Objects
dotenv.config();
const env = process.env
const app = express();
mongoose.connect(
    env.MONGO_URI,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },
    (err) => {
        if (err != null) {
            console.log(util.format('Error connecting to DB: %s', err));
        } else {
            console.log(util.format('Connected to: %s', env.MONGO_URI));
        }
    }
);

// Middleware
app.use(express.json());

// Routing
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

// Main
app.listen(env.APP_PORT, () => console.log(util.format('Server running at %d', env.APP_PORT)));
