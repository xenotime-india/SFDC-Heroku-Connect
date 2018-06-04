const http_mocks = require('node-mocks-http');

const controller = require('./account');

jest.mock('../services/knex', () => {
  const tracker = require('mock-knex').getTracker();
  const knex = require('knex');
  const mockDb = require('mock-knex');
  const db = knex({
    useNullAsDefault: true,
    client: 'sqlite'
  });
  mockDb.mock(db);
  tracker.install();
  tracker.on('query', query => {
    query.response([
      {
        sfid: '00100101101',
        name: 'account 001'
      },
      {
        sfid: '00100101102',
        name: 'account 001'
      }
    ]);
  });
  return db;
});

describe('/controllers/account', () => {
  it('should fetch account', async () => {
    let req = http_mocks.createRequest({
      url: 'http://somehost/api/account/fetch',
      body: {}
    });

    let res = http_mocks.createResponse();

    await controller.getAccounts(req, res, () => {});

    expect(JSON.parse(res._getData()).data.length).toEqual(2);
  });

  it('should insert account', async () => {
    let req = http_mocks.createRequest({
      url: 'http://somehost/api/account/upsert',
      body: {
        name: 'dummy account name',
        city: 'xyz',
        country: 'india',
        webSite: 'http://www.dummyhost.com',
        description: ''
      }
    });

    let res = http_mocks.createResponse();

    await controller.upsertAccount(req, res, () => {});

    expect(JSON.parse(res._getData()).message).toEqual(
      'Account upsert action complete successfully.'
    );
  });

  it('should delete account', async () => {
    let req = http_mocks.createRequest({
      url: 'http://somehost/api/account/delete?sfid=00100101102'
    });

    let res = http_mocks.createResponse();

    await controller.deleteAccount(req, res, () => {});

    expect(JSON.parse(res._getData()).message).toEqual(
      'Account already deleted.'
    );
  });
});
