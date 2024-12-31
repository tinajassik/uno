import { Request, Response } from "express";
import { UserService } from "../services/userService";

export const userController = {
    /**
     * Registers a new user.
     * @param req - Express request object.
     * @param res - Express response object.
     */
    registerUser: (req: Request, res: Response) => {
        const { username, password } = req.body;

        try {
            UserService.registerUser(username, password);
            res.status(201).json({ message: "User registered successfully!" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    /**
     * Logs in a user.
     * @param req - Express request object.
     * @param res - Express response object.
     */
    loginUser: (req: Request, res: Response) => {
        const { username, password } = req.body;

        try {
            const user = UserService.verifyLogin(username, password);
            if (user) {
                res.status(200).json({ message: "Login successful!", user });
            } else {
                res.status(401).json({ message: "Invalid username or password." });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    /**
     * Retrieves a user's profile.
     * @param req - Express request object.
     * @param res - Express response object.
     */
    getUserProfile: (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const user = UserService.getUserProfile(Number(id));
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "User not found." });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
};
