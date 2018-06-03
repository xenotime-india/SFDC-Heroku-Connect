const jwt = require('jsonwebtoken');
const redisService = require('../services/redis');
const { promisify } = require('util');
const verify = promisify(jwt.verify);
const config = require('config');
const ms = require('ms');
const moment = require('moment');

module.exports = {
  sign,
  verifyToken
};

async function sign(payload) {
  let expiresIn = config.JWT_EXPIRES_IN || `1d`;
  let expiresInMs = ms(expiresIn);
  let expiresInDate = moment().add(expiresInMs, 'ms');
  let accessToken = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: expiresIn
  });

  // Persist the refresh token to redis
  // This allows for a quick mechanism to verify that we issued it and also
  // a way to quickly expire all refresh tokens in the event of a breach
  let refreshTokenPayload = { ...payload, created_at: new Date() };
  let refreshToken = jwt.sign(refreshTokenPayload, config.JWT_SECRET);
  let redisResult = await redisService.set(
    config.REDIS_REFRESH_TOKENS_DB,
    refreshToken,
    true
  );
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresInDate.toDate().getTime()
  };
}

async function verifyToken(token) {
  let decoded = await verify(token, config.JWT_SECRET);
  return decoded;
}
