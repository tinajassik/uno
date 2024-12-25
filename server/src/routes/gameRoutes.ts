// routes/gameRoutes.ts
import express from 'express';
import { gameController } from '../controllers/gameController';

const router = express.Router();

router.post('/games', gameController.createGame);
router.post('/games/:id/join', gameController.joinGame);
router.post('/games/:id/start', gameController.startGame);
router.post('/games/:id/play', gameController.playTurn);
router.get('/games/:id', gameController.getGameState);
router.get('/games/', gameController.getGameList);

export default router;
