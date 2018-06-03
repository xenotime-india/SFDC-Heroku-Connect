const fetch = require('node-fetch');
const winston = require('winston');
const refresh = require('passport-oauth2-refresh');
const { promisify } = require('util');

const requestNewAccessToken = promisify(refresh.requestNewAccessToken);

module.exports = {
  request,
  api
};

async function request(options) {
  const restUrl =
    options.path.substr(0, 6) == 'https:'
      ? options.path
      : `${options.oauth.instance_url}${options.path}`;
  winston.info(
    `\n\nrest.request - method: ${options.method} restUrl: ${restUrl} data: ${
      options.data
    }`
  );

  try {
    let response = await fetch(restUrl, {
      method: options.method,
      data: options.data,
      headers: {
        Accept: 'application/json',
        Authorization: 'OAuth ' + options.oauth.access_token,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache,no-store,must-revalidate'
      }
    });
    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      // Session expired or invalid
      winston.info('Invalid session - trying a refresh');
      const accessToken = await requestNewAccessToken(
        'salesforce',
        options.refresh
      );

      response = await fetch(restUrl, {
        method: options.method,
        data: options.data,
        headers: {
          Accept: 'application/json',
          Authorization: 'OAuth ' + accessToken,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache,no-store,must-revalidate'
        }
      });
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (e) {
    return e;
  }
}

function api({ accessToken, refresh, apiVersion, user }) {
  const oauth = {
    access_token: accessToken,
    instance_url: user.urls.rest.replace('/v{version}', '')
  };

  apiVersion = apiVersion || '42.0';

  return {
    versions: async () => {
      const options = {
        oauth,
        refresh,
        path: ''
      };
      return await request(options);
    },

    resources: async () => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/`
      };
      return await request(options);
    },

    describeGlobal: async () => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/`
      };
      return await request(options);
    },

    identity: async () => {
      const options = {
        oauth,
        refresh,
        path: oauth.id
      };
      return await request(options);
    },

    metadata: async (objtype, callback, error) => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/${objtype}/`
      };
      return await request(options);
    },

    describe: async objtype => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/${objtype}/describe/`
      };
      return await request(options);
    },

    create: async (objtype, fields) => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/${objtype}/`,
        method: 'POST',
        data: JSON.stringify(fields)
      };
      return await request(options);
    },

    retrieve: async (objtype, id, fields) => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/${objtype}/${id}${
          fields ? '?fields=' + fields : ''
        }`
      };
      return await request(options);
    },

    upsert: async (objtype, externalIdField, externalId, fields) => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/${objtype}/${externalIdField}/${externalId}`,
        method: 'PATCH',
        data: JSON.stringify(fields)
      };
      return await request(options);
    },

    update: async (objtype, id, fields) => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/${objtype}/${id}`,
        method: 'PATCH',
        data: JSON.stringify(fields)
      };
      return await request(options);
    },

    del: async (objtype, id) => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/sobjects/${objtype}/${id}`,
        method: 'DELETE'
      };
      return await request(options);
    },

    search: async sosl => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/search/?q=${escape(sosl)}`
      };
      return await request(options);
    },

    query: async soql => {
      const options = {
        oauth,
        refresh,
        path: `v${apiVersion}/query?q=${escape(soql)}`
      };

      return await request(options);
    }
  };
}
