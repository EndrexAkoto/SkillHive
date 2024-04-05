import dotenv from 'dotenv';
import getEnvironmentPath from './enviroment.js';

const configureEnvironment = () => {
  dotenv.config({ path: getEnvironmentPath() });
  return process.env;
};

export default configureEnvironment;
