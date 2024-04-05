/**
 * This is a module of a function to get the path of the current file, for the environment file
 * @parent utils
 * @module enviroment
 *
 * @requires __dirname from utils/path.js to get the path of the current file
 *
 * @example import getEnvironmentPath from './utils/enviroment.js';
 *
 * @return {String} getEnvironmentPath - The path of the environment file
 */
import __dirname from './path.js'

const getEnvironmentPath = () => {
  const environment = process.env.ENVIRONMENT
  const environmentMap = {
    production: '.env.production',
    stage: '.env.stage',
    development: '.env.development'
  }
  return `${__dirname}/../${environmentMap[environment] || '.env'}`
}

export default getEnvironmentPath