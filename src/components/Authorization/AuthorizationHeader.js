// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import './AuthorizationHeader.scss';

type PropsType = {
  isSignUp: ?boolean,
  alone: ?boolean,
  onClick: Function,
  tabs: Array<{ id: string, name: string }>,
};

type StateType = {
  selected: number,
};

class AuthorizationHeader extends Component<PropsType, StateType> {
  state = {
    selected: 0,
  };
  handleClick = (name: string, selected: number) => {
    const { onClick } = this.props;
    this.setState({ selected }, onClick(name));
  };
  render() {
    const { tabs } = this.props;
    const { selected } = this.state;
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
