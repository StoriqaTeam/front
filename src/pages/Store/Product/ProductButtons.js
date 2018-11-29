// @flow strict

import React from 'react';
import { routerShape } from 'found';
import { join } from 'ramda';

import { Button } from 'components/common/Button';

import './ProductButtons.scss';

type PropsType = {
  onAddToCart: () => void,
  onBuyNow: () => void,
  onAddToCartTracker: () => void,
  unselectedAttr: ?Array<string>,
  quantity: number,
  preOrder: boolean,
  isAddToCart: boolean,
  router: routerShape,
  isLoading: boolean,
};

const ProductButtons = ({
  onAddToCart,
  unselectedAttr,
  quantity,
  preOrder,
  isAddToCart,
  router,
  onBuyNow,
  onAddToCartTracker,
  isLoading,
}: PropsType) => (
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
        Buy now
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
      >
        {!isAddToCart ? 'Add to cart' : 'View cart'}
      </Button>
    </div>
    {unselectedAttr && (
      <div styleName="message">
        You must select an attribute(s): {join(', ', unselectedAttr)}
      </div>
    )}
  </div>
);

export default ProductButtons;
