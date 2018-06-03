const Promise = require('bluebird');
const redis = require('redis');
const { REDIS_URL } = require('config');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient({
  url: `${REDIS_URL}`
});

async function set(redisDatabase, key, value) {
  return await redisClient
    .multi()
    .select(redisDatabase)
    .set(key, value)
    .execAsync();
}

async function get(redisDatabase, key) {
  redisClient.select(redisDatabase);
  return await redisClient.getAsync(key);
}

async function del(redisDatabase, key) {
  return await redisClient
    .multi()
    .select(redisDatabase)
    .del(key)
    .execAsync();
}

module.exports = {
  set,
  del,
  get,
  redisClient
};
