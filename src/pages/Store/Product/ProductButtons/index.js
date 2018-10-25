// @flow strict

import React from 'react';
import { routerShape } from 'found';

import { Button } from 'components/common/Button';

import './ProductButtons.scss';

import t from './i18n';

type PropsType = {
  onAddToCart: () => void,
  unselectedAttr: ?Array<string>,
  quantity: number,
  preOrder: boolean,
  isAddToCart: boolean,
  router: routerShape,
};

const ProductButtons = ({
  onAddToCart,
  unselectedAttr,
  quantity,
  preOrder,
  isAddToCart,
  router,
}: PropsType) => (
  <div styleName="container">
    <div styleName="buttons">
      <Button disabled big>
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
      <div styleName="message">{t.youMustSelectAnAttribute}</div>
    )}
  </div>
);

export default ProductButtons;
