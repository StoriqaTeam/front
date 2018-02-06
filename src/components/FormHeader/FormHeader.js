// @flow

import React from 'react';

import './FormHeader.scss';

type PropTypes = {
  title: string,
  linkTitle: string,
};

const FormHeader = (props: PropTypes) => (
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

export default FormHeader;
