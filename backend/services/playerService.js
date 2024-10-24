"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastPlayerId = getLastPlayerId;
exports.validatePlayer = validatePlayer;
exports.appendPlayer = appendPlayer;
const fs = __importStar(require("fs"));
const filePath = './playerData.ndjson';
// Function to get the highest player ID from the existing file
function getLastPlayerId() {
    if (!fs.existsSync(filePath)) {
        return 0; // No file exists yet, so return 0
    }
    const data = fs.readFileSync(filePath, 'utf8').trim();
    if (!data) {
        return 0; // File is empty
    }
    const players = data.split('\n').map(line => JSON.parse(line));
    const lastPlayer = players[players.length - 1];
    return lastPlayer.id; // Return the highest current player ID
}
// Validate if a player with the given username exists
function validatePlayer(username) {
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
function appendPlayer(username, password) {
    // Check if the player already exists
    if (validatePlayer(username)) {
        throw new Error(`Player with username "${username}" already exists.`);
    }
    const lastId = getLastPlayerId();
    const newPlayer = {
        id: lastId + 1, // Increment the ID for the new player
        name: username,
        password: password
    };
    // Append the new player to the NDJSON file
    fs.appendFileSync(filePath, JSON.stringify(newPlayer) + '\n');
}
