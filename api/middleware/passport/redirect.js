const { sign } = require('../../services/jwt');
const config = require('config');
const qs = require('qs');

module.exports = async (req, res, next) => {
  try {
    let tokenPayload = await sign(req.user);
    let state = {};
    if (req.body.RelayState || req.body.wctx) {
      try {
        // This can come from ADFS (WSFed) or SAML
        state = JSON.parse(req.body.RelayState || req.body.wctx);
      } catch (error) {
        console.error(error);
      }
    }
    let { redirect_uri } = state;
    let redirectUrl = `${config.LOCAL_WEBCLIENT_ROOT}/token`;

    redirectUrl = redirect_uri || redirectUrl;
    return res.redirect(`${redirectUrl}?${qs.stringify(tokenPayload)}`);
  } catch (error) {
    const responseMessage = (config.IS_DEV) ? {error} : {message: `Unrecognized user`};
    return res.status(401).json(responseMessage);
  }
};
