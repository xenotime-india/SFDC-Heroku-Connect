import React from 'react';
import qs from 'qs';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ProfileActionCreators from '../redux/actions/profile';
import Loading from './../components/Loading';
import { LOCAL_STORAGE, REACT_APP_API_URL } from '../constants';

class Token extends React.Component {
  state = {
    error: null,
    loading: true
  };

  async componentDidMount() {
    const { location } = this.props;
    const queryParams = qs.parse(location.search.replace('?', ''));
    const { access_token, refresh_token, expires_in } = queryParams;
    if (access_token) {
      try {
        const profile = await this.findProfile(access_token);

        this.setProfile({
          ...profile,
          access_token,
          refresh_token,
          expires_in
        });
      } catch (error) {
        this.setState({ error });
      }
    } else {
      this.setState({ error: new Error(`Not a valid access_token`) });
    }
  }

  findProfile = async accessToken => {
    if (accessToken) {
      const url = `${REACT_APP_API_URL.URL}/api/user/profile`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      };
      const result = await fetch(url, options);
      const jsonResponse = await result.json();
      return jsonResponse;
    }
    return null;
  };

  setProfile = profile => {
    const { profileActions } = this.props;
    profileActions.setUserProfile(profile);
    localStorage.setItem(LOCAL_STORAGE.TOKEN, JSON.stringify(profile));
    this.setState({
      profile,
      loading: false
    });
  };

  render() {
    const { error } = this.state;
    const { profile } = this.props;
    let redirectUrl = !error ? '/' : '/error/token';
    return !profile.access_token && !error ? (
      <Loading isLoading={this.state.loading} />
    ) : (
      <Redirect to={redirectUrl} />
    );
  }
}

function mapStateToProps(state) {
  let { profile } = state;
  return {
    profile
  };
}

function mapDispatchToProps(dispatch) {
  return {
    profileActions: bindActionCreators(ProfileActionCreators, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Token);
