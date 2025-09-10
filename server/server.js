import express from 'express';
import http from 'http';
import cors from "cors";
import 'dotenv/config'
import connectDB from './lib/db.js';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

//Express app setup
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

//Socket.io setup
export const io = new Server(server, {
    cors: {
        origin: [`${process.env.CLIENT_URL}`],
        credentials: true
    }
});

//Store current online users
export const userSocketMap = new Map();

//socket connection
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap.set(userId, socket.id);

    io.emit('online-users', Array.from(userSocketMap.keys()));

    socket.on('disconnect', () => {
        if (userId) userSocketMap.delete(userId);
        io.emit('online-users', Array.from(userSocketMap.keys())); 
    });
});

//setup cors
app.use(cors({
  origin: [`${process.env.CLIENT_URL}`],
  credentials: true,
}));
    
//Middlewares
app.use(express.json({limit: '4mb'}));
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);

//Database connection
await connectDB();

//Starting the server

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});