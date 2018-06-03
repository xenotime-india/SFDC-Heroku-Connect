import { PROFILE } from '../actionTypes';

export function retrieveProfileFromToken(accessToken) {
  return async (dispatch, store) => {
    dispatch({
      type: PROFILE.RETRIEVE_PROFILE_FROM_TOKEN,
      profile: {
        firstName: 'TODO: firstName',
        lastName: 'TODO: lastName',
        email: 'TODO: email'
      }
    });
  };
}

export function setUserProfile(profile) {
  return async (dispatch, store) => {
    dispatch({
      type: PROFILE.SET_USER_PROFILE,
      profile
    });
  };
}
