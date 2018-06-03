const config = require('config');
const passport = require('passport');
const SalesforceStrategy = require('passport-salesforce').Strategy;
const refresh = require('passport-oauth2-refresh');

const redirect = require('./redirect');

module.exports = SalesforceProvider;

function SalesforceProvider(app) {
  const clientID = config.SALESFORCE_OAUTH_CONSUMER_KEY;
  const clientSecret = config.SALESFORCE_OAUTH_CONSUMER_SECRET;
  const callbackURL = config.SALESFORCE_OAUTH_CALLBACK_URL;

  const salesforceOAuthConfig = { clientID, clientSecret, callbackURL };

  app.get(
    '/auth/salesforce',
    passport.authenticate('salesforce', {
      session: false
    })
  );

  app.get(
    '/auth/salesforce/callback',
    passport.authenticate('salesforce', {
      session: false
    }),
    redirect
  );
  const strategy = new SalesforceStrategy(salesforceOAuthConfig, verify)
  refresh.use(strategy);
  return strategy;
}

function verify(accessToken, refreshToken, profile, next) {
  // Will be embedded in req.user
  return next(null, { accessToken, refreshToken, profile });
}
