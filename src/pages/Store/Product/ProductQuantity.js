import React, { Fragment } from 'react';
import classNames from 'classnames';

import Stepper from 'components/Stepper';

import './ProductQuantity.scss';

type PropsType = {
  quantity: number,
  preOrder: boolean,
  preOrderDays: number,
  onChangeQuantity: (quantity: number) => void,
  cartQuantity: number,
};

const ProductQuantity = (props: PropsType) => {
  const isPreOrderAvailable =
    props.quantity === 0 && props.preOrder && props.preOrderDays;
  return (
    <div styleName="container">
      {isPreOrderAvailable ? null : (
        <Fragment>
          <div styleName="title">
            <strong>Amount</strong>
          </div>
          <div styleName="counter">
            <Stepper
              value={props.quantity === 0 ? 0 : props.cartQuantity}
              min={props.quantity === 0 ? 0 : 1}
              max={props.quantity}
              onChange={
                props.quantity === 0 ? () => {} : props.onChangeQuantity
              }
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
        </Fragment>
      )}

      {isPreOrderAvailable && (
        <div styleName="preOrder">
          <div styleName="title">
            <strong>Pre order</strong>
          </div>
          <div styleName="preOrderText">
            <div>Available for pre-order.</div>
            <div>
              Lead time (days):{' '}
              <span styleName="preOrderDays">{props.preOrderDays}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductQuantity;
