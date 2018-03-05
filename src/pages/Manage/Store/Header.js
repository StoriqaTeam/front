// @flow

import React, { PureComponent } from 'react';

import './Header.scss';

type PropsType = {
  title: string,
  children: ?any;
};

class Header extends PureComponent<PropsType> {
  render() {
    const { title, children } = this.props;
    return (
      <div styleName="header">
        <span styleName="title">{title}</span>
        {children}
      </div>
    );
  }
}

export default Header;
