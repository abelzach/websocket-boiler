import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
 cors: {
   origin: '*',
   methods: ['GET', 'POST'],
   allowedHeaders: ["*"]
 },
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('chat-msg', (msg) => {
        console.log('Received msg ' + msg);
        // Emit the message to connected client
        // io.emit('chat msg', msg);
   });

});

// Define a route
app.get('/', (req, res) => {
 res.send('Websocket!');
});


// Start the server
server.listen(port, () => {
 console.log(`Server is listening at http://localhost:${port}`);
});
