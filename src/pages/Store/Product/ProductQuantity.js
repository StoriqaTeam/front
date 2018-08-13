import React from 'react';

import Stepper from 'components/Stepper';

import './ProductQuantity.scss';

type PropsType = {
  quantity: number,
};

const ProductQuantity = (props: PropsType) => (
  <div styleName="container">
    <div styleName="title">
      <strong>Amount</strong>
    </div>
    <div styleName="counter">
      <Stepper value={0} min={0} max={props.quantity} onChange={() => {}} />
      <p styleName="stock">Remaining stock:</p>
      <span styleName="inStock">{`In stock (${props.quantity})`}</span>
    </div>
  </div>
);

export default ProductQuantity;
