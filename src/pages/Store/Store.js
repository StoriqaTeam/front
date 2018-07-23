// @flow

import React, { Fragment, PureComponent } from 'react';

import { Header, Footer } from 'components/App';

import type { Node } from 'react';

type PropsType = {
  children: Node,
};

class Store extends PureComponent<PropsType> {
  render() {
    return (
      <Fragment>
        <Header />
        {this.props.children}
        <Footer />
      </Fragment>
    );
  }
}

export default Store;
