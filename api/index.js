const winston = require("winston");
const SwaggerExpress = require("swagger-express-mw");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const { redisClient } = require("./services/redis");
const connectToPassport = require("./middleware/passport");

const {
  RATE_LIMIT_REQUESTS_PER_MINUTE,
  RATE_LIMIT_MINUTES_TILL_RESET
} = require("config");

// Promisify Swagger
Promise.promisifyAll(SwaggerExpress);

module.exports = api;

let config = {
  appRoot: path.join(__dirname, ".."),
  configDir: path.join(__dirname, "./config")
};

async function api(app) {
  const limiter = require("express-limiter")(app, redisClient);
  limiter({
    path: "*",
    method: "all",
    lookup: ["connection.remoteAddress"],
    total: RATE_LIMIT_REQUESTS_PER_MINUTE * RATE_LIMIT_MINUTES_TILL_RESET,
    expire: 1000 * 60 * RATE_LIMIT_MINUTES_TILL_RESET
  });

  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  app = connectToPassport(app);

  const swaggerExpress = await SwaggerExpress.createAsync(config);
  swaggerExpress.register(app);

  return app;
}
