// @flow

import React, { PureComponent } from 'react';

import { Header, Main, Footer } from 'components/App';

import './Page.scss';

export default OriginalComponent => class Page extends PureComponent {
  render() {
    return (
      <div styleName="container">
        <Header />
        <Main>
          <OriginalComponent {...this.props} />
        </Main>
        <Footer />
      </div>
    );
  }
};
