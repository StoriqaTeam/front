// @flow

import React from 'react';
import { Button } from 'components/common/Button';

import './ProductButtons.scss';

type PropsType = {
  onAddToCart: () => any,
  unselectedAttr: ?Array<string>,
  quantity: number,
  preOrder: boolean,
};

const ProductButtons = ({
  onAddToCart,
  unselectedAttr,
  quantity,
  preOrder,
}: PropsType) => (
  <div styleName="container">
    <div styleName="buttons">
      <Button disabled big>
        Buy now
      </Button>
      <Button
        id="productAddToCart"
        wireframe
        big
        disabled={!quantity && !preOrder}
        onClick={onAddToCart}
        dataTest="product-addToCart"
      >
        Add to cart
      </Button>
    </div>
    {unselectedAttr && (
      <div styleName="message">You must select an attribute</div>
    )}
  </div>
);

export default ProductButtons;
