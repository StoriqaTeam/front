// @flow

import React, { PureComponent } from 'react';

import { Header, Main, Footer } from 'components/App';

import './Page.scss';

export default (OriginalComponent: any) => class Page extends PureComponent<{}> {
  render() {
    console.log('---this.props', this.props);
    console.log('---this.context', this.context);
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
