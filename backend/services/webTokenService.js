const jwt = require('jsonwebtoken');

const SECRET_KEY = 'MostSecretKeyEver';

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username, 
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = { generateToken };