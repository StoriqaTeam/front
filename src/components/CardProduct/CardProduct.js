// @flow

import React, { PureComponent } from 'react';
import { head, pathOr } from 'ramda';

import { Icon } from 'components/Icon';

import { formatPrice } from './utils';

import './CardProduct.scss';

type PropsTypes = {
  item: {
    baseProduct: {
      name: string,
      currencyId: string,
    },
    variants: {
      discount: string,
      photoMain: string,
      cashback: string,
      price: string,
    },
  },
};

class CardProduct extends PureComponent<PropsTypes> {
  render() {
    const {
      item: {
        baseProduct,
        variants,
      },
    } = this.props;

    const title = baseProduct ? baseProduct.name : null;
    const img = pathOr(null, ['product', 'photoMain'], head(variants));
    const undiscountedPrice = Number(pathOr(null, ['product', 'price'], head(variants)));
    const discount = pathOr(null, ['product', 'discount'], head(variants));
    const price = undiscountedPrice * (1 - discount);
    // const currencyId = baseProduct ? baseProduct.currencyId : null;
    const cashback = pathOr(null, ['product', 'discount'], head(variants)) * 100;

    return (
      <div styleName="container">
        <div styleName="body">
          <div styleName="top">
            {img &&
              <div>
                <img styleName="img" src={img} alt="img" />
              </div>
            }
          </div>
          <div styleName="bottom">
            <div styleName="icon">
              <Icon type="qa" size="16" />
            </div>
            {title && <div styleName="title">{title}</div>}
            <div styleName="price">
              {undiscountedPrice &&
                <div styleName="undiscountedPrice">
                  {formatPrice(undiscountedPrice)} STQ
                </div>
              }
              {price &&
                <div styleName="actualPrice">
                  <strong>{formatPrice(price)} STQ</strong>
                </div>
              }
              {cashback &&
                <div styleName="cashbackWrap">
                  <div styleName="cashback">Cashback {`${cashback}%`}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CardProduct;
