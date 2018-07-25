// @flow

import React, { PureComponent, cloneElement } from 'react';
import type { Element } from 'react';
import { isNil, pathOr } from 'ramda';

import { Page } from 'components/App';
import { Collapse } from 'components/Collapse';
import { Container } from 'layout';
import { getNameText } from 'utils';

import { StoreContext, StoreHeader } from './index';

import './Store.scss';

const tabs = [
  {
    id: 'showcase',
    title: 'Show',
    isNew: false,
    link: '',
  },
  {
    id: 'items',
    title: 'Items',
    isNew: false,
    link: '/items',
  },
  {
    id: 'reviews',
    title: 'Reviews',
    isNew: false,
    link: null,
  },
  {
    id: 'actions',
    title: 'Actions',
    isNew: true,
    link: null,
  },
  {
    id: 'about',
    title: 'About',
    isNew: false,
    link: '/about',
  },
];

type PropsType = {
  children: Element<*>,
  store: ?{
    id: string,
    rawId: number,
    logo: ?string,
    cover: ?string,
    name: {
      lang: string,
      text: string,
    },
    rating: number,
  },
};

class Store extends PureComponent<PropsType> {
  render() {
    const { children, store } = this.props;
    if (isNil(store)) {
      return <div styleName="storeNotFound">Store Not Found</div>;
    }
    // $FlowIgnore
    const logo = pathOr(null, ['logo'], store);
    // $FlowIgnore
    const cover = pathOr(null, ['cover'], store);
    const name = getNameText(store.name, 'EN');
    return (
      <StoreContext.Provider
        value={{
          logo,
          cover,
          tabs,
          storeId: store.rawId,
          name,
          rating: store.rating,
          // $FlowIgnore
          active: children.key,
        }}
      >
        <Container>
          <StoreHeader />
          <div styleName="mobileTabs">
            <Collapse transparent items={tabs} />
          </div>
          {children && cloneElement(children, { shop: store })}
        </Container>
      </StoreContext.Provider>
    );
  }
}

export default Page(Store, true);
