import envs from './dotenv.js';
import Mongoose from 'mongoose';
import logger from './logger.js';

envs;
const dbType = process.env.DB_TYPE;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const url = `${dbType}://${dbHost}:${dbPort}/${dbName}`;

if (!dbType || !dbHost || !dbPort || !dbName) {
  logger.warn(`Please provide the database connection string in order to connect to ${dbName} database`);
  process.exit(1);
}

const client = async () => {
  try {
    await Mongoose.connect(url);
    logger.info(`MongoDB database ${dbName} is connected successfully to the server`);
  } catch (error) {
    logger.error(error);
  }
};

if (!client) {
  logger.warn(`Please provide the database connection string in order to connect to ${dbName} database`);
  process.exit(1);
}

export default client;