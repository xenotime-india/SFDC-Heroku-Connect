const config = require("config");
const express = require("express");
const winston = require("winston");
const api = require("./api");

// Server-wide settings
winston.level = config.WINSTON_LEVEL;
const dev = config.NODE_ENV !== "production";
const serverRoutes = ["/api", "/auth"];

// Scaffold the server
async function startServer() {
  const app = await api(express());
  app.use(express.static("build"));
  app.get("*", (req, res, next) => {
    if (serverRoutes.find(route => req.url.startsWith(route)) === undefined) {
      return res
        .set("Content-Type", "text/html")
        .sendFile(__dirname + "/build/index.html");
    }
    return next();
  });

  app.listen(config.PORT, err => {
    if (err) throw err;
    winston.info(`> Ready on http://localhost:${config.PORT}`);
  });
}

// Start the server
startServer();
