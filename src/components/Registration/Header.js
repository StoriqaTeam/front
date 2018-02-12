// @flow

import React from 'react';

import './Header.scss';

type PropTypes = {
  title: string,
  linkTitle: string,
};

const Header = (props: PropTypes) => (
  <header styleName="container">
    <strong styleName="title">{ props.title }</strong>
    <a
      href="/login"
      styleName="linkTitle"
    >
      { props.linkTitle }
    </a>
  </header>
);

export default Header;
