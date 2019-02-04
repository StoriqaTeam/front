// @flow strict

import React from 'react';
import { routerShape } from 'found';
import { join } from 'ramda';

import { Button } from 'components/common/Button';

import './ProductButtons.scss';

import t from './i18n';

type PropsType = {
  onAddToCart: () => void,
  onBuyNow: () => void,
  onAddToCartTracker: () => void,
  unselectedAttr: ?Array<string>,
  quantity: number,
  preOrder: boolean,
  preOrderDays: number,
  isAddToCart: boolean,
  router: routerShape,
  isLoading: boolean,
  isLoadingAddToCart: boolean,
};

const ProductButtons = ({
  onAddToCart,
  unselectedAttr,
  quantity,
  preOrder,
  preOrderDays,
  isAddToCart,
  router,
  onBuyNow,
  onAddToCartTracker,
  isLoading,
  isLoadingAddToCart,
}: PropsType) => {
  const isPreOrderAvailable = quantity === 0 && preOrder && preOrderDays;
  return (
    <div styleName="container">
      <div styleName="buttons">
        <Button
          big
          isLoading={isLoading}
          disabled={!quantity && !preOrder}
          onClick={onBuyNow}
          onMouseDown={onAddToCartTracker}
          dataTest="product-BuyNow"
        >
          {isPreOrderAvailable ? t.preOrder : t.buyNow}
        </Button>
        <Button
          id="productAddToCart"
          wireframe
          big
          disabled={!quantity && !preOrder}
          onClick={
            !isAddToCart
              ? onAddToCart
              : () => {
                  router.push('/cart');
                }
          }
          onMouseDown={onAddToCartTracker}
          dataTest="product-addToCart"
          isLoading={isLoadingAddToCart}
        >
          {!isAddToCart ? t.addToCart : t.viewCart}
        </Button>
      </div>
      {unselectedAttr && (
        <div styleName="message">
          {t.youMustSelectAnAttribute} {join(', ', unselectedAttr)}
        </div>
      )}
    </div>
  );
};

export default ProductButtons;
