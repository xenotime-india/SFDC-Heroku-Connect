const winston = require('winston');
const redisService = require('../services/redis');
const jwtService = require('../services/jwt');
const config = require('config');
const passport = require('passport');

module.exports = function withAuth(routeHandler) {
  return async (req, res, next) => {
    try {
      const authorization = req.headers['authorization'] || '';
      const token = authorization.replace('Bearer ', '');
      const decoded = await jwtService.verifyToken(token);
      const issuedRefreshToken = await redisService.get(
        config.REDIS_REFRESH_TOKENS_DB,
        token
      );
      if (issuedRefreshToken) {
        // Cannot use refresh token to authenticate
        throw new Error(`Invalid token`);
      }
      req = Object.assign(req, {
        user: decoded.profile,
        accessToken: decoded.accessToken,
        refresh: decoded.refreshToken
      });
      return routeHandler(req, res, next);
    } catch (error) {
      const responseMessage = config.IS_DEV
        ? { error }
        : { message: `Unauthorized access detected` };
      return res.status(401).json(responseMessage);
    }
  };
};
