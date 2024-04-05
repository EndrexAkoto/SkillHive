/**
 * The following module class is used to connect to redis
 * @parent utils
 * @module redis
 *
 * @requires redis from node modules to connect to redis
 * @requires env from utils/dotenv.js to get the environment variables
 * @requires logger from utils/logger.js to log the errors and info
 *
 * @example import RedisClient from './utils/redis.js';
 *
 * @return {Object} RedisClient - The redis client object
 */

import redis from 'redis';
import envs from './dotenv.js';
import logger from './logger.js';

envs;

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisPassword = process.env.REDIS_PASSWORD;

class RedisClient {
  constructor () {
    this.clientRedis = redis.createClient({
      host: redisHost,
      port: redisPort,
      password: redisPassword
    })
      .on('error', error => {
        logger.error('Error connecting to redis', error);
      })
      .on('connect', () => {
        logger.info('Redis is connected successfully to the server');
      })
      .on('end', () => {
        logger.info('Redis connection is closed');
      });
  }

  async connect () {
    return await this.clientRedis.connect();
  }

  async set (key, value) {
    if (!key || !value) {
      logger.warn(
        'Please provide the key and value in order to set it in redis'
      );
      process.exit(1);
    }
    return await this.clientRedis.set(key, value, (error, reply) => {
      if (error) {
        logger.error(error);
      }
      logger.info(reply);
    });
  }

  async get (key) {
    if (!key) {
      logger.warn(
        'Please provide the key in order to get the value from redis'
      );
      process.exit(1);
    }
    return await this.clientRedis.get(key, (error, value) => {
      if (error) {
        logger.error(error);
      }
      logger.info(value);
    });
  }

  async hget (hash, key) {
    if (!hash || !key) {
      logger.warn(
        'Please provide the hash and key in order to get the value from redis'
      );
      process.exit(1);
    }
    return await this.clientRedis.hget(hash, key, (error, value) => {
      if (error) {
        logger.error(error);
      }
      logger.info(value);
    });
  }

  async expire (key, time) {
    if (!key || !time) {
      logger.warn(
        'Please provide the key and time in order to expire it from redis'
      );
      process.exit(1);
    }
    return await this.clientRedis.expire(key, time);
  }

  async del (key) {
    if (!key) {
      logger.warn('Please provide the key in order to delete it from redis');
      process.exit(1);
    }
    return await this.clientRedis.del(key);
  }
}

export default new RedisClient();