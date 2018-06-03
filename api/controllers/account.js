const knex = require('./../services/knex');
const paginator = require('./../util/knex-paginator');
const uuidv4 = require('uuid/v4');

module.exports = {
  getAccounts,
  upsertAccount,
  deleteAccount
};

// insert or update account record
async function upsertAccount(req, res, next) {
  try {
    const { name, city, country, webSite, description, sfid } = req.body;

    if (sfid) {
      // update action if sfid available
      await knex('salesforce.account')
        .where({ sfid: sfid })
        .update({
          name,
          website: webSite,
          description,
          billingcity: city,
          billingcountry: country
        });
    } else {
      // insert action if sfid not available
      await knex('salesforce.account').insert({
        name,
        website: webSite,
        description,
        billingcity: city,
        external_id__c: uuidv4(),
        billingcountry: country
      });
    }

    return res.json({
      message: 'Account upsert action complete successfully.'
    });
  } catch (error) {
    next(error);
  }
}

// delete account
async function deleteAccount(req, res, next) {
  try {
    const { sfid } = req.query;

    const result = await knex('salesforce.account')
      .where({ sfid: sfid })
      .del();

    if (result == 1) {
      return res.json({
        message: 'Account deleted successfully.'
      });
    } else {
      return res.json({
        message: 'Account already deleted.'
      });
    }
  } catch (error) {
    next(error);
  }
}

// fetch account records
async function getAccounts(req, res, next) {
  try {
    const perPage = req.body.pageSize || 10;
    const page = req.body.page || 1;
    const sortby = req.body.sortby || { id: 'name', desc: false };
    const filtered = req.body.filtered || [];

    let where = query => {
      filtered.forEach(filter => {
        query = query.where(filter.id, 'like', `%${filter.value}%`);
      });
      return query;
    };

    const ticketsQuery = knex('salesforce.account')
      .select('*')
      .where(where)
      .orderBy(sortby.id, sortby.desc ? 'DESC' : 'ASC');

    const { data, pagination } = await paginator(where(ticketsQuery), {
      perPage,
      page
    });

    return res.json({
      data,
      pagination
    });
  } catch (error) {
    next(error);
  }
}
