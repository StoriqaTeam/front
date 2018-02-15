// @flow

import React from 'react';
import { Link } from 'found';

import './Header.scss';

type PropTypes = {
  title: string,
  linkTitle: string,
  link: string,
};

const Header = (props: PropTypes) => (
  <header styleName="container">
    <strong styleName="title">
      { props.title }
    </strong>
    <Link
      styleName="linkTitle"
      to={props.link}
    >
      { props.linkTitle }
    </Link>
  </header>
);

export default Header;
