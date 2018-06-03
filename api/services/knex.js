const knex = require('knex');
const pg = require('pg');
const config = require('config');

pg.defaults.ssl =
  config.DATABASE_URL.indexOf('127.0.0.1') < 0 &&
  config.DATABASE_URL.indexOf('app_postgres') < 0;

module.exports = knex({
  client: 'pg',
  connection: config.DATABASE_URL,
  searchPath: 'public'
});
