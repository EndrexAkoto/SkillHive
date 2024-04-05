/**
 * The following module is used to get the path of the current file
 * @parent utils
 * @module path
 * @requires path from node core modules to get the path of the current file
 * @requires fileUrlToPath from node core modules to convert the file url to path
 * 
 * @example import __dirname from './utils/path.js';
 * 
 * @returns {String} __dirname - The path of the current file
 */
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;