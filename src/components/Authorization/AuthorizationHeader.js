// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import './AuthorizationHeader.scss';

type PropsType = {
  // isSignUp: ?boolean,
  // alone: ?boolean,
  selected: number,
  onClick: Function,
  tabs: Array<{ id: string, name: string }>,
};

class AuthorizationHeader extends Component<PropsType, {}> {
  handleClick = (name: string, selected: number) => {
    const { onClick } = this.props;
    onClick(name, selected)
  };
  render() {
    const { tabs, selected } = this.props;
    return (
      <div styleName="container">
        <nav styleName="tabsContainer">
          <ul styleName="tabs">
            {tabs.map(({ id, name }, index) => (
              /* eslint-disable */
              <li
                tabIndex="-1"
                key={id}
                onClick={() => this.handleClick(name, index)}
                onKeyPress={() => {}}
                styleName={classNames('tab', {
                  clicked: selected === index,
                })}
              >
                {name}
              </li>
            ))}
          </ul>
        </nav>
        {/* {alone ? (
          <Link
            styleName="linkTitle"
            onClick={handleToggle}
            to={isSignUp ? '/login' : '/registration'}
            data-test={isSignUp ? 'loginLink' : 'registrationLink'}
          >
            {linkText}
          </Link>
        ) : (
          <div
            styleName="linkTitle"
            onClick={handleToggle}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
            data-test={
              isSignUp ? 'loginToggleButton' : 'registrationToggleButton'
            }
          >
            {linkText}
          </div>
        )} */}
      </div>
    );
  }
}

export default AuthorizationHeader;
