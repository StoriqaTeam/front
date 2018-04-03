// @flow

import React, { PureComponent } from 'react';

import { Header, Main, Footer } from 'components/App';

import './Page.scss';

type PropsType = {
  me: ?{},
};

export default (OriginalComponent: any) => class Page extends PureComponent<PropsType> {
  render() {
    return (
      <div styleName="container">
        <Header user={this.props.me} />
        <Main>
          <OriginalComponent {...this.props} />
        </Main>
        <Footer />
      </div>
    );
  }
};
