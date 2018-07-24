// @flow

import React, { PureComponent, cloneElement } from 'react';
import type { Element } from 'react';

import { Page } from 'components/App';
import { Container } from 'layout';


import type { routes_Store_QueryResponse as StoreType } from 'routes/__generated__/routes_Store_Query.graphql';

type PropsType = {
  children: Element<*>,
  store: StoreType,
};

class Store extends PureComponent<PropsType> {
  render() {
    const { children, store } = this.props;
    return (
      <Container>
        <div className="header">header</div>
        {children && cloneElement(children, { shop: store })}
      </Container>
    );
  }
}

export default Page(Store, true);
