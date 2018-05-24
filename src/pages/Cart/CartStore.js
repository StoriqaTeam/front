// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { Rating } from 'components/common/Rating';
import { Button } from 'components/common/Button';
import { Input } from 'components/common/Input';
import { Icon } from 'components/Icon';
import { formatPrice, getNameText } from 'utils';

import CartProduct from './CartProduct';
import CartProductAttribute from './CartProductAttribute';

// eslint-disable-next-line
import type CartStore_store from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

type PropsType = {
  // eslint-disable-next-line
  store: CartStore_store,
  totals: { productsCost: number, deliveryCost: number, totalCount: number },
};

/* eslint-disable react/no-array-index-key */
class CartStore extends PureComponent<PropsType> {
  render() {
    const { store } = this.props;
    const { products } = store;
    return (
      <div styleName="container">
        <div styleName="products">
          {products.map((product, idx) => (
            <CartProduct key={idx} product={product} />
          ))}
        </div>
        <div styleName="footer">
          <div styleName="store">
            <div styleName="store-info">
              <img src={store.logo} alt="store_picture" styleName="image" />
              <div styleName="store-description">
                <div styleName="store-name">
                  {getNameText(store.name, 'EN')}
                </div>
                <Rating value={store.rating} />
              </div>
            </div>
            <div styleName="chat-container">
              <Icon type="chat" size={24} />
              <div styleName="chat-text">Chat with Seller</div>
            </div>
            <div styleName="promocode">
              <Input
                fullWidth
                focus={false}
                onChange={() => {}}
                detectCapsLock
                model="TBA"
                name="TBA"
                label="Promocode"
              />
            </div>
          </div>
          <div styleName="store-total">
            <div styleName="store-total-header">Seller summary</div>
            <CartProductAttribute
              title="Products cost"
              value={`${formatPrice(this.props.totals.productsCost || 0)} STQ`}
            />
            <CartProductAttribute
              title="Delivery cost"
              value={`${formatPrice(this.props.totals.deliveryCost || 0)} STQ`}
            />
            <CartProductAttribute
              title="Total cost"
              value={`${formatPrice(
                this.props.totals.deliveryCost +
                  this.props.totals.productsCost || 0,
              )} STQ`}
            />
            <div styleName="buy">
              <Button type="wireframe" disabled big>
                Buy from this seller
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  CartStore,
  graphql`
    fragment CartStore_store on CartStore {
      products {
        ...CartProduct_product
      }
      name {
        lang
        text
      }
      rating
      logo
    }
  `,
);
