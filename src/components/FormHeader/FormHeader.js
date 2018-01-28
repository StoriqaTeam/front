// @flow

import React from 'react';

import './FormHeader.scss';

type PropTypes = {
  title?: string,
  linkTitle?: string
};

const FormHeader = (props: PropTypes) => (
  <header styleName="container">
    <h1 styleName="title">{ props.title }</h1>
    <a styleName="linkTitle">{ props.linkTitle }</a>
  </header>
);

FormHeader.defaultProps = {
  title: 'Storiqa',
  linkTitle: 'link',
};

export default FormHeader;
