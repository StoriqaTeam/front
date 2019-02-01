// @flow strict

import React from 'react';
import { routerShape, withRouter } from 'found';

import { Button } from 'components/common';

import './CartRest.scss';

type PropsType = {
  count: number,
  cartType: 'fiat' | 'crypto',
  router: routerShape,
};

const CartRest = ({ count, cartType, router }: PropsType) => (
  <div styleName="container">
    <span className="text">
      {`You have ${count} more items with ${cartType} payment method left in your cart`}
    </span>
    <div styleName="button">
      <Button
        big
        onClick={() => {
          router.push('/cart');
        }}
      >
        {`Checkout left ${count} ${count === 1 ? 'item' : 'items'}`}
      </Button>
    </div>
  </div>
);

export default withRouter(CartRest);
