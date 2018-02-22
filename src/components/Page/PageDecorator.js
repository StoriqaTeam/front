import React, { Component } from 'react';

import { Header } from 'components/Header';
import { Main } from 'components/Main';
import { Footer } from 'components/Footer';

import './Page.scss';

export default OriginalComponent => class Page extends Component { // eslint-disable-line
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
