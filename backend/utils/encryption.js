import bycrypt from 'bcrypt';

class encryption {
  static async hash (data) {
    return await bycrypt.hash(data, 12);
  }

  static async compare (data, hashedData) {
    return await bycrypt.compare(data, hashedData);
  }
}

export default encryption;