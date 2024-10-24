const express = require('express');
const { appendPlayer } = require('../services/playerService');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* POST append a player with username and password as URL parameters. */
router.post('/registerPlayer/:username/:password', async (req, res, next) => {
  const { username, password } = req.params;

  try {
    const result = await appendPlayer(username, password); // Call your playerService to append player
    res.status(201).json({ message: 'Player registered successfully', player: result });
  } catch (error) {
    console.error('Error registering player:', error);
    res.status(500).json({ message: 'Error registering player', error: error.message });
  }
});

module.exports = router;
