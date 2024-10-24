import * as fs from 'fs';
import { PlayerDto } from '../dto/playerDto';

const filePath = './playerData.ndjson';

// Function to get the highest player ID from the existing file
export function getLastPlayerId(): number {
  if (!fs.existsSync(filePath)) {
    return 0; // No file exists yet, so return 0
  }

  const data = fs.readFileSync(filePath, 'utf8').trim();
  if (!data) {
    return 0; // File is empty
  }

  const players = data.split('\n').map(line => JSON.parse(line));
  const lastPlayer = players[players.length - 1];
  
  return lastPlayer.id;  // Return the highest current player ID
}

// Validate if a player with the given username exists
export function validatePlayer(username: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false; // No file exists, no players to validate
  }

  const data = fs.readFileSync(filePath, 'utf8').trim();
  if (!data) {
    return false; // File is empty, no players to validate
  }

  const players = data.split('\n').map(line => JSON.parse(line));
  
  // Check if the username already exists
  return players.some(player => player.name === username);
}

// Append a new player to the file with auto-incrementing ID
export function appendPlayer(username: string, password: string): void {
  // Check if the player already exists
  if (validatePlayer(username)) {
    throw new Error(`Player with username "${username}" already exists.`);
  }

  const lastId = getLastPlayerId();
  const newPlayer = {
    id: lastId + 1,  // Increment the ID for the new player
    name: username,
    password: password
  };

  // Append the new player to the NDJSON file
  fs.appendFileSync(filePath, JSON.stringify(newPlayer) + '\n');
}
