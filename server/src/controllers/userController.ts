import { Request, Response } from "express";

export const userController = {
    registerUser: (req: Request, res: Response) => {
        const { username, password } = req.body;
        console.log(`Registering user: ${username}`);
        res.status(201).json({ message: "User registered successfully!", username });
    },

    loginUser: (req: Request, res: Response) => {
        const { username, password } = req.body;
        console.log(`Logging in user: ${username}`);
        res.status(200).json({ message: "Login successful!", token: "dummy-token" });
    },

    getUserProfile: (req: Request, res: Response) => {
        const { id } = req.params;
        console.log(`Fetching profile for user ID: ${id}`);
        res.status(200).json({ id, username: "TestUser", scores: 100 });
    }
};
