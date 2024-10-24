class Player {
    constructor(id, name, password) {
      this.id = id;
      this.name = name;
      this.password = password;
    }
  
    // Method to return player data as a JSON object
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        password: this.password
      };
    }
  
    // Method to validate if all required player fields are present
    static validate(playerData) {
      const { id, name, password } = playerData;
      if (!id || !name || !password) {
        throw new Error('Missing id, name, or password');
      }
    }
  }
  
  module.exports = Player;