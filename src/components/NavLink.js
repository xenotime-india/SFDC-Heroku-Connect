import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class NavLink extends Component {
  render() {
    let isActive =
      this.context.router.route.location.pathname === this.props.to;
    let className = isActive
      ? 'slds-context-bar__item slds-is-active'
      : 'slds-context-bar__item';

    return (
      <li className={className}>
        <Link {...this.props} />
      </li>
    );
  }
}

NavLink.contextTypes = {
  router: PropTypes.object
};

export default NavLink;
