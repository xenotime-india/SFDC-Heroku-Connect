const passport = require("passport");
const SalesforceProvider = require("./salesforce");

module.exports = connectToPassport;

function connectToPassport(app) {
  passport.use(SalesforceProvider(app));
  app.use(passport.initialize());
  return app;
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
