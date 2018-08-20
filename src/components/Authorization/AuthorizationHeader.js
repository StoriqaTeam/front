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
  fullWidth?: boolean,
};

class AuthorizationHeader extends Component<PropsType, {}> {
  static defaultProps = {
    fullWidth: false,
  };
  handleClick = (name: string, selected: number) => {
    const { onClick } = this.props;
    onClick(name, selected);
  };
  render() {
    const { tabs, selected, fullWidth } = this.props;
    return (
      <div styleName={classNames('container', { fullWidth })}>
        <nav styleName="tabsContainer">
          <ul styleName={classNames('tabs', { fullWidth })}>
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
