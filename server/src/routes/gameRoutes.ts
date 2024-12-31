// routes/gameRoutes.ts
import express from 'express';
import { gameController } from '../controllers/gameController';

const router = express.Router();

router.post('/create', gameController.createGame);
router.post('/:id/join', gameController.joinGame);
router.post('/:id/start', gameController.startGame);
router.post('/:id/play', gameController.playTurn);
router.post('/playWithBots', gameController.playWithBots);
// router.get('/:id', gameController.getGameState);
router.get('/', gameController.getGameList);

export default router;
