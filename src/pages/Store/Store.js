// @flow

import React, { PureComponent, cloneElement } from 'react';
import type { Element } from 'react';

import { Page } from 'components/App';
import { Collapse } from 'components/Collapse';
import { Container } from 'layout';

import type { routes_Store_QueryResponse as StoreType } from 'routes/__generated__/routes_Store_Query.graphql';

import { StoreContext, StoreHeader } from './index';

import './Store.scss';

const tabs = [
  {
    id: '0',
    title: 'Show',
    isNew: false,
  },
  {
    id: '1',
    title: 'Items',
    isNew: false,
  },
  {
    id: '2',
    title: 'Reviews',
    isNew: false,
  },
  {
    id: '3',
    title: 'Actions',
    isNew: true,
  },
  {
    id: '4',
    title: 'About',
    isNew: false,
  },
];

type PropsType = {
  children: Element<*>,
  store: StoreType,
};

class Store extends PureComponent<PropsType> {
  handleSelected = () => {};
  render() {
    const { children, store } = this.props;
    return (
      <StoreContext.Provider
        value={{
          logo:
            'https://vignette.wikia.nocookie.net/zimwiki/images/5/53/Irken_Invader_Logo_by_Danial79_%281%29.jpg/revision/latest?cb=20120611162935',
          image:
            'https://1256852360.rsc.cdn77.org/en/100593/air-jordan-1-mid-black-white-black.jpg',
          tabs,
        }}
      >
        <Container>
          <StoreHeader />
          <div styleName="mobileTabs">
            <Collapse
              transparent
              items={tabs}
              onSelected={this.handleSelected}
            />
          </div>
          {children && cloneElement(children, { shop: store })}
        </Container>
      </StoreContext.Provider>
    );
  }
}

export default Page(Store, true);
