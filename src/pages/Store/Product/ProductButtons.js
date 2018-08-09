// @flow

import React from 'react';
import { Button } from 'components/common/Button';

import './ProductButtons.scss';

type PropsType = {
  onAddToCart: () => any,
  unselectedAttr: ?Array<string>,
};

const ProductButtons = ({ onAddToCart, unselectedAttr }: PropsType) => (
  <div styleName="container">
    <div styleName="buttons">
      <Button disabled big>
        Buy now
      </Button>
      <Button
        id="productAddToCart"
        wireframe
        big
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
