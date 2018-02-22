// @flow

import React from 'react';

import { Header, Main, Footer } from 'components/App';

import './Page.scss';

export default (OriginalComponent: any) => {
  const PageDecorator = (props: any) => (
    <div styleName="container">
      <Header />
      <Main>
        <OriginalComponent {...props} />
      </Main>
      <Footer />
    </div>
  );

  return PageDecorator;
};
