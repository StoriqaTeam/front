import React from 'react';

import Stepper from 'components/Stepper';

import './ProductQuantity.scss';

const ProductQuantity = () => (
  <div styleName="container">
    <h4>Amount</h4>
    <div styleName="counter">
      <Stepper value={0} min={0} max={9999} onChange={() => {}} />
      <p styleName="stock">Remaining stock:</p>
      <span styleName="inStock">In stock (0)</span>
    </div>
  </div>
);

export default ProductQuantity;
