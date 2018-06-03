import React from 'react';
import NavLink from './NavLink';
import { Icon } from 'react-lightning-design-system';
import { isLoggedIn } from './../services/authentication';

const appName = 'SFDC-Heroku Connect';

export default props => {
  return (
    <div className="slds-context-bar">
      <div className="slds-context-bar__primary">
        <div className="slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger_click slds-no-hover">
          <div className="slds-context-bar__icon-action">
            <button
              className="slds-button slds-icon-waffle_container slds-context-bar__button"
              title="Description of the icon when needed"
            >
              <span className="slds-icon-waffle">
                <span className="slds-r1" />
                <span className="slds-r2" />
                <span className="slds-r3" />
                <span className="slds-r4" />
                <span className="slds-r5" />
                <span className="slds-r6" />
                <span className="slds-r7" />
                <span className="slds-r8" />
                <span className="slds-r9" />
              </span>
              <span className="slds-assistive-text">Open App Launcher</span>
            </button>
          </div>
          <span className="slds-context-bar__label-action slds-context-bar__app-name">
            <span className="slds-truncate" title="App Name">
              {appName}
            </span>
          </span>
        </div>
      </div>
      <nav className="slds-context-bar__secondary" role="navigation">
        <ul className="slds-grid">
          <NavLink className="slds-context-bar__label-action" to="/">
            <span className="slds-truncate" title="Home">
              Heroku Connect
            </span>
          </NavLink>

          {props.profile.name && (
            <NavLink
              className="slds-context-bar__label-action"
              to="/salesfoce-rest"
            >
              <span className="slds-truncate" title="Home">
                Salesforce Rest
              </span>
            </NavLink>
          )}
        </ul>
        <div>
          {!props.profile.name && (
            <button className="login-btn slds-button" onClick={props.login}>
              Login
            </button>
          )}
          {props.profile.name &&
            props.profile.name && (
              <div className="slds-text-align_center">
                <span className="slds-avatar slds-avatar_circle">
                  <span
                    className="slds-icon_container slds-icon-standard-user"
                    title="Description of icon when needed"
                  >
                    <Icon icon="standard:user" />
                    <span className="slds-assistive-text">
                      Description of icon when needed
                    </span>
                  </span>
                </span>{' '}
                {props.profile.name}
              </div>
            )}
        </div>
      </nav>
    </div>
  );
};
