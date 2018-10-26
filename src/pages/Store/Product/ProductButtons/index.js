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
  isLoading,
}: PropsType) => (
  <div styleName="container">
    <div styleName="buttons">
      <Button big isLoading={isLoading} onClick={onBuyNow} disabled>
        {t.buyNow}
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
        dataTest="product-addToCart"
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

export default ProductButtons;
