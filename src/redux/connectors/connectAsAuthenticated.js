import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import * as ProfileActionCreators from '../actions/profile';
import { reAuthenticate, isLoggedIn } from './../../services/authentication';

export default function connectAsAuthenticated(WrappedComponent) {
  class ConnectedComponent extends React.Component {
    componentDidMount() {
      if(!isLoggedIn()) {
        reAuthenticate();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
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
      push: bindActionCreators(push, dispatch),
      profileActions: bindActionCreators(ProfileActionCreators, dispatch)
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(ConnectedComponent);
}
