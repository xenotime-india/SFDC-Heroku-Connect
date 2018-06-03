const knex = require('./../services/knex');
const paginator = require('./../util/knex-paginator');
const uuidv4 = require('uuid/v4');
const withAuth = require('../middleware/withAuth');
const { api } = require('../services/salesforce-rest');

module.exports = {
  getContacts: withAuth(getContacts),
  deleteContact: withAuth(deleteContact)
};

// fetch contacts from saleforce using oauth
async function getContacts(req, res, next) {
  try {
    const perPage = req.body.pageSize || 10;
    const page = req.body.page || 1;
    const offset = (page - 1) * perPage;
    const sortby = Object.assign({ id: 'name', desc: false }, req.body.sortby);
    const filtered = req.body.filtered || [];

    let where = '';
    filtered.forEach(filter => {
      where += `${filter.id} LIKE '%${filter.value}%'`;
    });
    where = where != '' ? `WHERE ${where}` : '';

    const result = await api(req).query(
      `SELECT id, name, title, Department, Email, Phone, Description, Account.Name
       FROM contact
       ${where}
       ORDER BY ${sortby.id} ${sortby.desc ? 'DESC' : 'ASC'} NULLS LAST
       LIMIT ${perPage} 
       OFFSET ${offset}`
    );

    const totalResult = await api(req).query(
      `SELECT count()
       FROM contact`
    );
    return res.json({
      data: result.records,
      pagination: totalResult.totalSize
    });
  } catch (error) {
    next(error);
  }
}

// delete contact record
async function deleteContact(req, res, next) {
  try {
    const { id } = req.query;
    const result = await api(req).del('contact', id);

    return res.json(result);
  } catch (error) {
    next(error);
  }
}
