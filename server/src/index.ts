import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import gameRoutes from "./routes/gameRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import { Server as SocketIOServer } from 'socket.io';
import { GameService } from './services/gameService';
import http from 'http';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

GameService.initialize(io);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Test");
});

app.use(cors());
app.use(express.json());
app.use('/games', gameRoutes);
app.use('/user', userRoutes);

// Use server.listen instead of app.listen
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});