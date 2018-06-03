const withAuth = require('../middleware/withAuth');

module.exports = {
  profile: withAuth(profile)
};

async function profile(req, res) {
  return res.json({
    ...req.user
  });
}
