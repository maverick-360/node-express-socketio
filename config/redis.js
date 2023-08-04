const { createClient } = require("redis");

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 16438,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

module.exports = redisClient;
