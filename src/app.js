import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import { isLoggedIn, getToken, reAuthenticate } from "./services/authentication";

// Higher Order Components
import { connectAsAuthenticated, connectAsAnonymous } from './redux/connectors';

// Routes
import Root from './pages/Root';
import SalesforceRest from './pages/SalesforceRest';
import NotFound from './pages/NotFound';
import Token from './pages/Token';
import Loading from './components/Loading';

import Header from './components/Header';
import { LOCAL_STORAGE, REACT_APP_API_URL } from "./constants";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ProfileActionCreators from "./redux/actions/profile";
import { push } from "react-router-redux";
import { history } from "./redux/store";

class App extends React.Component {
  state = {
    loading: false,
    profile: {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {

    if(nextProps.profile !== prevState.profile) {
      return {
        profile: nextProps.profile
      }
    }
    return null;
  }

  async componentDidMount() {
    const { profileActions, push } = this.props;
    if(isLoggedIn) {
      const auth = getToken();
      if(auth) {
        this.setState( { loading: true } )
        const profile = await this.findProfile(auth.access_token);
        profileActions.setUserProfile(profile);
        this.setState( {
          loading: false
        })
      }
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

  login = () => {
    this.setState( { loading: true } )
    reAuthenticate();
  }

  render() {
    const { loading, profile } = this.state;

    return (<ConnectedRouter history={history}><div>
          <Loading isLoading={loading}/>
          <Header login={this.login} profile={profile}/>
          <Switch>
            <Route exact path="/" component={connectAsAnonymous(Root)} />
            <Route
              exact
              path="/salesfoce-rest"
              component={connectAsAuthenticated(SalesforceRest)}
            />
            <Route exact path="/token" component={Token} />
            <Route component={NotFound} />
          </Switch>
        </div>
    </ConnectedRouter>);
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
