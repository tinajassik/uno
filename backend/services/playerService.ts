import * as fs from 'fs';
// import { PlayerDto } from '../dto/playerDto';

const filePath = './playerData.ndjson';

// Function to get the highest player ID from the existing file
export function getLastUserId(): number {
  if (!fs.existsSync(filePath)) {
    return 0; // No file exists yet, so return 0
  }

  const data = fs.readFileSync(filePath, 'utf8').trim();
  if (!data) {
    return 0; // File is empty
  }

  const users = data.split('\n').map(line => JSON.parse(line));
  const lastUser = users[users.length - 1];
  
  return lastUser.id;  // Return the highest current player ID
}

// Validate if a user with the given username exists
export function validateUsername(username: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false; // No file exists, no players to validate
  }

  const data = fs.readFileSync(filePath, 'utf8').trim();
  if (!data) {
    return false;
  }

  const users = data.split('\n').map(line => JSON.parse(line));
  
  return users.some(user => user.name === username);
}

// Append a new user to the file with auto-incrementing ID
export function registerUser(username: string, password: string): void {

  if (validateUsername(username)) {
    throw new Error(`Player with username "${username}" already exists.`);
  }

  const lastId = getLastUserId();
  const newUser = {
    id: lastId + 1,
    name: username,
    password: password
  };

  fs.appendFileSync(filePath, JSON.stringify(newUser) + '\n');
}

// Validate user login
export function verifyUserLogin(username: string, password: string): { id: string, name: string } | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const data = fs.readFileSync(filePath, 'utf8').trim();
  if (!data) {
    return null;
  }

  const users = data.split('\n').map(line => JSON.parse(line));

  const user = users.find(user => user.name === username && user.password === password);

  return user ? { id: user.id, name: user.name } : null;
}
