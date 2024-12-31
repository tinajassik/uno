import * as fs from 'fs';
import * as path from 'path';

// Constants
const filePath = path.resolve('./src/storage/userData.ndjson');

// Utility to read and parse NDJSON file
function readUsers(): any[] {
  if (!fs.existsSync(filePath)) return [];

  const data = fs.readFileSync(filePath, 'utf8').trim();
  return data ? data.split('\n').map(line => JSON.parse(line)) : [];
}

// Utility to write users back to the NDJSON file
function writeUsers(users: any[]): void {
  const ndjsonData = users.map(user => JSON.stringify(user)).join('\n');
  fs.writeFileSync(filePath, ndjsonData + '\n', 'utf8');
}

export class UserService {
  /**
   * Gets the next user ID based on the current data.
   * @returns {number} Next user ID.
   */
  private static getNextUserId(): number {
    const users = readUsers();
    return users.length > 0 ? users[users.length - 1].id + 1 : 1;
  }

  /**
   * Checks if a username already exists.
   * @param username - Username to validate.
   * @returns {boolean} True if username exists, false otherwise.
   */
  static isUsernameTaken(username: string): boolean {
    const users = readUsers();
    return users.some(user => user.username === username);
  }

  /**
   * Registers a new user with a unique username.
   * @param username - User's username.
   * @param password - User's password.
   * @throws Error if username already exists.
   */
  static registerUser(username: string, password: string): void {
    if (this.isUsernameTaken(username)) {
      throw new Error(`Player with username "${username}" already exists.`);
    }

    const newUser = {
      id: this.getNextUserId(),
      username: username,
      password // In a real app, hash the password
    };

    const users = readUsers();
    users.push(newUser);
    writeUsers(users);
  }

  /**
   * Validates a user's login credentials.
   * @param username - User's username.
   * @param password - User's password.
   * @returns {{ id: string, username: string } | null} User info if valid, null otherwise.
   */
  static verifyLogin(username: string, password: string): { id: string; username: string } | null {
    const users = readUsers();
    const user = users.find(user => user.username === username && user.password === password);
    return user ? { id: user.id, username: user.username } : null;
  }

  /**
   * Retrieves a user's profile by ID.
   * @param userId - User ID to search.
   * @returns {{ id: string, username: string } | null} User profile if found, null otherwise.
   */
  static getUserProfile(userId: number): { id: string; username: string } | null {
    const users = readUsers();
    const user = users.find(user => user.id === userId);
    return user ? { id: user.id, username: user.username } : null;
  }
}
