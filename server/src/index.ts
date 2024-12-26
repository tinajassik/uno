// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import gameRoutes from "./routes/gameRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Test");
});

app.use(express.json());
app.use('/games', gameRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});