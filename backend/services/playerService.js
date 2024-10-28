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
exports.getLastUserId = getLastUserId;
exports.validateUsername = validateUsername;
exports.registerUser = registerUser;
exports.verifyUserLogin = verifyUserLogin;
const fs = __importStar(require("fs"));
// import { PlayerDto } from '../dto/playerDto';
const filePath = './playerData.ndjson';
// Function to get the highest player ID from the existing file
function getLastUserId() {
    if (!fs.existsSync(filePath)) {
        return 0; // No file exists yet, so return 0
    }
    const data = fs.readFileSync(filePath, 'utf8').trim();
    if (!data) {
        return 0; // File is empty
    }
    const users = data.split('\n').map(line => JSON.parse(line));
    const lastUser = users[users.length - 1];
    return lastUser.id; // Return the highest current player ID
}
// Validate if a user with the given username exists
function validateUsername(username) {
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
function registerUser(username, password) {
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
function verifyUserLogin(username, password) {
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
