// @flow

import React, { Fragment, PureComponent, cloneElement } from 'react';

import { Page } from 'components/App';

import type { Node } from 'react';

type PropsType = {
  children: Node,
  store: any,
};

class Store extends PureComponent<PropsType> {
  render() {
    const { children, store } = this.props;
    console.log('---children, store', children, store);
    return (
      <Fragment>
        <div className="header">header</div>
        {cloneElement(
          <div>Element</div>,
          { store: this.props.store },
        )}
      </Fragment>
    );
  }
}

export default Page(Store);
