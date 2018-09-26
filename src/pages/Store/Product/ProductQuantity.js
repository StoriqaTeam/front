import React from 'react';
import classNames from 'classnames';

import Stepper from 'components/Stepper';

import './ProductQuantity.scss';

type PropsType = {
  quantity: number,
  preOrder: boolean,
  preOrderDays: number,
};

const ProductQuantity = (props: PropsType) => (
  <div styleName="container">
    <div styleName="title">
      <strong>Amount</strong>
    </div>
    <div styleName="counter">
      <Stepper
        value={props.quantity === 0 ? 0 : 1}
        min={0}
        max={props.quantity}
        onChange={() => {}}
      />
      <p styleName="stock">Remaining stock:</p>
      <span
        styleName={classNames('inStock', {
          zeroQuantity: props.quantity === 0,
        })}
      >
        {`In stock (${props.quantity})`}
      </span>
    </div>
    {props.preOrder && props.preOrderDays &&
      <div styleName="preOrder">
        <div styleName="title">
          <strong>Pre order</strong>
        </div>
        <div styleName="preOrderText">
          <div>This product is available for pre-order.</div>
          <div>Production time (days): <span styleName="preOrderDays">{props.preOrderDays}</span></div>
        </div>
      </div>
    }
  </div>
);

export default ProductQuantity;
