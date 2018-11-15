// @flow

import React, { PureComponent, cloneElement } from 'react';
import type { Element } from 'react';
import { isNil, pathOr } from 'ramda';
import { routerShape } from 'found';

import { Page } from 'components/App';
import { Collapse } from 'components/Collapse';
import { Container } from 'layout';
import { getNameText } from 'utils';

import type { CollapseItemType } from 'types';

import { StoreContext, StoreHeader } from './index';

import './Store.scss';

import t from './i18n';

const tabs = [
  {
    id: 'shop',
    title: t.shop,
    isNew: false,
    link: '',
  },
  {
    id: 'items',
    title: t.items,
    isNew: false,
    link: '/items',
  },
  // {
  //   id: 'reviews',
  //   title: 'Reviews',
  //   isNew: false,
  // },
  // {
  //   id: 'actions',
  //   title: 'Actions',
  //   isNew: true,
  // },
  {
    id: 'about',
    title: t.about,
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
    facebookUrl: ?string,
    twitterUrl: ?string,
    instagramUrl: ?string,
  },
  router: routerShape,
};

class Store extends PureComponent<PropsType> {
  onSelected = (item: CollapseItemType) => {
    const { store } = this.props;
    if (store) {
      this.props.router.push(`/store/${store.rawId}${item.link || ''}`);
    }
  };

  render() {
    const { children, store } = this.props;
    if (isNil(store)) {
      return <div styleName="storeNotFound">{t.storeNotFound}</div>;
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
          facebookUrl: store.facebookUrl || '',
          twitterUrl: store.twitterUrl || '',
          instagramUrl: store.instagramUrl || '',
        }}
      >
        <div styleName="container">
          <Container>
            <StoreHeader />
            <div styleName="mobileTabs">
              <Collapse
                transparent
                items={tabs}
                onSelected={this.onSelected}
                selected={!isNil(children) ? children.key : ''}
              />
            </div>
            {children && cloneElement(children, { shop: store })}
          </Container>
        </div>
      </StoreContext.Provider>
    );
  }
}

export default Page(Store);
