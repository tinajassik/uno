const express = require('express');
const { registerUser, verifyUserLogin } = require('../services/playerService');
const { generateToken } = require( '../services/webTokenService');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

/* POST register a user with username and password as URL parameters. */
router.post('/register/:username/:password', async (req, res, next) => {
  const { username, password } = req.params;

  try {
    const result = await registerUser(username, password); // Call your playerService to append player
    res.status(201).json({ message: 'Player registered successfully', player: result });
  } catch (error) {
    console.error('Error registering player:', error);
    res.status(500).json({ message: 'Error registering player', error: error.message });
  }
});

/* POST login a user with username and password as URL parameters. */
router.post('/login/:username/:password', async (req, res, next) => {
  const { username, password } = req.params;

  try {
    const user = await verifyUserLogin(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken({ id: user.id, username: user.name });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
});

module.exports = router;
