// Load .env configuration file
require("dotenv").config();
const joi = require("joi");

const envVarsSchema = joi
  .object({
    // TODO: Validate these a little more properly than just strings and numbers
    RATE_LIMIT_REQUESTS_PER_MINUTE: joi.number().integer().required(),
    RATE_LIMIT_MINUTES_TILL_RESET: joi.number().integer().required(),
    DATABASE_URL: joi.string().required(),
    REDIS_URL: joi.string().required(),
    POSTGRES_LOGGING: joi.string().required()
  })
  .unknown()
  .required();

const { error } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Missing environment variables detected! ${error.message}`);
}

module.exports = {
  PORT: process.env.PORT || 8080,
  DATABASE_URL: process.env.DATABASE_URL,
  WINSTON_LEVEL: process.env.WINSTON_LEVEL || "debug",
  NODE_ENV: process.env.NODE_ENV,
  IS_DEV: process.env.NODE_ENV !== 'production',
  POSTGRES_LOGGING: process.env.POSTGRES_LOGGING,
  POSTGRES_SCHEMA: process.env.POSTGRES_SCHEMA,
  REDIS_URL: process.env.REDIS_URL,
  RATE_LIMIT_REQUESTS_PER_MINUTE: parseInt(
    process.env.RATE_LIMIT_REQUESTS_PER_MINUTE
  ),
  RATE_LIMIT_MINUTES_TILL_RESET: parseInt(
    process.env.RATE_LIMIT_MINUTES_TILL_RESET
  ),
  LOCAL_WEBCLIENT_ROOT: process.env.LOCAL_WEBCLIENT_ROOT,
  SALESFORCE_OAUTH_CONSUMER_KEY: process.env.SALESFORCE_OAUTH_CONSUMER_KEY,
  SALESFORCE_OAUTH_CONSUMER_SECRET:
    process.env.SALESFORCE_OAUTH_CONSUMER_SECRET,
  SALESFORCE_OAUTH_CALLBACK_URL: process.env.SALESFORCE_OAUTH_CALLBACK_URL,
  REDIS_REFRESH_TOKENS_DB: process.env.REDIS_REFRESH_TOKENS_DB,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};
