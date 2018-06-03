import { LOCAL_STORAGE } from '../constants';

export function reAuthenticate() {
  localStorage.clear();
  let redirectUrl = `${process.env.REACT_APP_SALESFORCE_OAUTH_URL}?pathname=${
    window.location.pathname
  }`;
  window.location = redirectUrl;
}

export function isLoggedIn() {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}

export function getToken() {
  if (localStorage[LOCAL_STORAGE.TOKEN]) {
    return JSON.parse(localStorage[LOCAL_STORAGE.TOKEN]);
  }
  return null;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

function getTokenExpirationDate(token) {
  if (!token.expires_in) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(token.expires_in);

  return date;
}
