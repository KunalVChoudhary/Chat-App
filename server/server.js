import express from 'express';
import http from 'http';
import cors from "cors";
import 'dotenv/config'
import connectDB from './lib/db.js';

//Express app setup
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
    
//Middlewares
app.use(cors());
app.use(express.json({limit: '4mb'}));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Server is running");
}   );

//Database connection
import connectDB from './lib/db.js';
connectDB();

//Starting the server

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});