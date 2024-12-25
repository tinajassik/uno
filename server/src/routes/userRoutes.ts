// routes/userRoutes.ts
import express from 'express';
import { userController } from '../controllers/userController';

const router = express.Router();

router.post('/register', userController.registerUser); // Create a new user
router.post('/login', userController.loginUser);       // Log in a user
router.get('/:id', userController.getUserProfile);     // Get user profile

export default router;