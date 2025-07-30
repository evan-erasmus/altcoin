const { createClient } = require('redis');

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;

const redisString =  `redis://${host}:${port}`;

const redisClient = createClient({
  url: redisString
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connect() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

async function getCache(key) {
  return await redisClient.get(key);
}

async function setCache(key, value, ttl = 60) {
  await redisClient.set(key, JSON.stringify(value), { EX: ttl });
}

module.exports = { redisClient, connect, getCache, setCache };
