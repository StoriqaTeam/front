// @flow

import React, { PureComponent } from 'react';

import Header from './Header';
import TableTitle from './TableTitle';

type PropsType = {
  //
};

class Orders extends PureComponent<PropsType> {
  render() {
    return (
      <div>
        <Header />
        <TableTitle />
      </div>
    );
  }
}

export default Orders;
