/**
 * This is a module to load the environment variables
 * @parent utils
 * @module dotenv
 * @requires dotenv
 * @requires utils/enviroment for getEnvironmentPath function
 *
 * @example exports envs from './utils/dotenv.js';
 * 
 * @return {Object} envs - The environment variables
 */
import dotenv from 'dotenv';
import getEnvironmentPath from './enviroment.js';

const envs = dotenv.config({ path: getEnvironmentPath() });

export default envs;