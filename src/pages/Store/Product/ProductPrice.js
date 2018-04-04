// @flow

import React from 'react';


import './ProductPrice.scss';

const ProductPrice = () => (
  <div styleName="container">
    <span styleName="stqLast">
      0.000290 STQ
    </span>
    <div styleName="stq">
      <span styleName="stqPresent">
        0.000123 STQ
      </span>
      <button>
        Cashback 12%
      </button>
    </div>
  </div>
);

export default ProductPrice;
