// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';
import { head, path } from 'ramda';
import PropTypes from 'prop-types';

import { Icon } from 'components/Icon';
import { IncrementInCartMutation } from 'relay/mutations';
import { getNameText, log } from 'utils';

import { formatPrice } from './utils';

import './CardProduct.scss';

type VariantType = {
  discount: number,
  photoMain: string,
  cashback: number,
  price: number,
}

type PropsTypes = {
  item: {
    rawId: number,
    storeId: number,
    currencyId: number,
    name: Array<{
      lang: string,
      text: string,
    }>,
    variants: Array<VariantType>,
  }
}

class CardProduct extends PureComponent<PropsTypes> {
  handleClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Env: ", this.context.environment);
    const id = path(['props', 'item', 'rawId'], this);
    if (id) {
      IncrementInCartMutation.commit({
        input: { clientMutationId: '', productId: id },
        environment: this.context.environment,
        onCompleted: (response, errors) => {
          log.debug('Success for IncrementInCart mutation');
          if (response) { log.debug('Response: ', response); }
          if (errors) { log.debug('Errors: ', errors); }
        },
        onError: (error) => {
          log.error('Error in IncrementInCart mutation');
          log.error(error);
          // eslint-disable-next-line
          alert('Unable to add product to cart');
        },
      });
    } else {
      alert('Something went wrong :('); // eslint-disable-line
      log.error('Unable to add an item without productId');
    }
  }

  render() {
    const {
      item: {
        rawId,
        storeId,
        name,
        variants,
        currencyId,
      },
    } = this.props;
    if (!storeId || !rawId || !currencyId || !variants || variants.length === 0) return null;
    const {
      discount,
      photoMain,
      cashback,
      price,
    } = head(variants);
    const lang = 'EN';
    const productLink = `/store/${storeId}/products/${rawId}`;
    const discountedPrice = price * (1 - discount);
    const cashbackValue = cashback ? (cashback * 100).toFixed(0) : null;
    return (
      <div styleName="container">
        <Link
          to={productLink}
          styleName="body"
        >
          <div styleName="top">
            {!photoMain ?
              <Icon type="camera" size="40" /> :
              <img styleName="img" src={photoMain} alt="img" />
            }
          </div>
          <div styleName="bottom">
            <div styleName="icon">
              <Icon type="qa" size="20" />
            </div>
            {name && <div styleName="title">{getNameText(name, lang)}</div>}
            <div styleName="price">
              {Boolean(discount) &&
                <div styleName="undiscountedPrice">
                  {formatPrice(price)} STQ
                </div>
              }
              {discountedPrice &&
                <div styleName="actualPrice">
                  <strong>{formatPrice(discountedPrice)} STQ</strong>
                </div>
              }
              {cashbackValue &&
                <div styleName="cashbackWrap">
                  <div styleName="cashback">Cashback {`${cashbackValue}%`}</div>
                </div>
              }
            </div>
            <button onClick={e => this.handleClick(e)}>Add to cart</button>
          </div>
        </Link>
      </div>
    );
  }
}

export default CardProduct;

CardProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
};
