// @flow

import React, { Component } from 'react';

import { log } from 'utils';

class Product extends Component {
  render() {
    log.debug({ props: this.props });
    return (
      <div>Hi!</div>
    );
  }
}

export default Product;
