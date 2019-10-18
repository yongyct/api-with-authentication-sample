// Base libraries
const util = require('util')
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const SocketIo = require('socket.io');
const https = require('https');

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

// Middleware Parsers
app.use(express.json());

// Routing Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/app/chat', express.static('public'));

// Main
const server = app.listen(env.APP_PORT, () => console.log(util.format('Server running at %d', env.APP_PORT)));
const webSocketIo = SocketIo(server);

// webSocketIo => session pool instantiated by server
// webSocket => session pool instantiated by client
// webSocketIo.sockets => all webSockets (instatiated by clients)
webSocketIo.on('connection', (webSocket) => {
    console.log(util.format('Websocket established with client: %s', webSocket.id));

    // Broadcast incoming data from client
    webSocket.on('chat', (data) => {
        webSocketIo.sockets.emit('chat', data);
    });

    // Broadcast typing event from client to other clients (except the source client)
    webSocket.on('typing', (data) => {
        webSocket.broadcast.emit('typing', data);
    });

    // Broadcast realtime data from public api
    setInterval(() => {
        const req = https.request({
            hostname: 'api.coindesk.com',
            path: '/v1/bpi/currentprice.json',
            method: 'GET'
        }, (res) => {
            var responseBody = '';
            res.on('data', (dataChunk) => {
                responseBody += dataChunk
            }).on('end', () => {
                webSocketIo.sockets.emit('psi', JSON.parse(responseBody));
            });
        });
        req.on('error', (err) => {
            console.log(util.format('Error hitting PSI API: %s', err));
        });
        req.end();
    }, 5000);

});
