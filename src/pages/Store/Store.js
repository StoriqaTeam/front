// @flow

import React, { PureComponent, cloneElement } from 'react';
import type { Element } from 'react';
import { isNil } from 'ramda';

import { Page } from 'components/App';
import { Container } from 'layout';

import type { routes_Store_QueryResponse as StoreType } from 'routes/__generated__/routes_Store_Query.graphql';

import { StoreContext, StoreHeader } from './index';

import './Store.scss';

type PropsType = {
  children: Element<*>,
  store: StoreType,
};

class Store extends PureComponent<PropsType> {
  handleClick = () => {};
  render() {
    const { children, store } = this.props;
    if (isNil(store)) {
      return <div styleName="storeNotFound">Store Not Found</div>;
    }
    return (
      <StoreContext.Provider
        value={{
          logo:
            'https://vignette.wikia.nocookie.net/zimwiki/images/5/53/Irken_Invader_Logo_by_Danial79_%281%29.jpg/revision/latest?cb=20120611162935',
          image:
            'https://1256852360.rsc.cdn77.org/en/100593/air-jordan-1-mid-black-white-black.jpg',
        }}
      >
        <Container>
          <StoreHeader />
          {children && cloneElement(children, { shop: store })}
        </Container>
      </StoreContext.Provider>
    );
  }
}

export default Page(Store, true);
