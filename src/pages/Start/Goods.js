// @flow strict

import React, { PureComponent } from 'react';

import { Icon } from 'components/Icon';

import './Goods.scss';

type ProductType = {
  rawId: number,
  store: {
    rawId: number,
  },
  name: Array<{
    lang: string,
    text: string,
  }>,
  currency: string,
  variants: {
    first: {
      rawId: number,
      discount: number,
      photoMain: string,
      cashback: number,
      price: number,
    },
  },
  rating: number,
};

type PropsType = {
  items: Array<{
    node: ProductType,
  }>,
  title: string,
  seeAllUrl: string,
};

class Goods extends PureComponent<PropsType> {
  render() {
    const { title, items, seeAllUrl } = this.props;
    //
    return (
      <div styleName="container">
        <div styleName="header">
          <div styleName="title">{title}</div>
          <div styleName="nav">
            <button direction="prev" styleName="button" onClick={() => {}}>
              <Icon type="prev" size={32} />
            </button>
            <button direction="next" styleName="button" onClick={() => {}}>
              <Icon type="next" size={32} />
            </button>
          </div>
          {seeAllUrl && (
            <a styleName="reveal" href={seeAllUrl} data-test="seeAllLink">
              See all
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default Goods;
