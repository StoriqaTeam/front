// @flow strict

import React, { Fragment } from 'react';
import classNames from 'classnames';

import Stepper from 'components/Stepper';

import './ProductQuantity.scss';

import t from './i18n';

type PropsType = {
  quantity: number,
  preOrder: boolean,
  preOrderDays: number,
  onChangeQuantity: (quantity: number) => void,
  cartQuantity: number,
};

const numberToWords = (val: number): string => {
  if (val <= 10) {
    return `${val}`;
  } else if (val >= 11 && val <= 100) {
    return t.numbersInWords.dozens;
  }

  return t.numbersInWords.hundreds;
};

const ProductQuantity = (props: PropsType) => {
  const isPreOrderAvailable = Boolean(
    props.quantity === 0 && props.preOrder && props.preOrderDays,
  );
  return (
    <div styleName="container">
      {isPreOrderAvailable ? null : (
        <Fragment>
          <div styleName="title">
            <strong>{t.amount}</strong>
          </div>
          <div styleName="counter">
            {(props.quantity || props.preOrder) && (
              <div styleName="stepper">
                <Stepper
                  value={props.quantity === 0 ? 0 : props.cartQuantity}
                  min={props.quantity === 0 ? 0 : 1}
                  max={props.quantity}
                  onChange={
                    props.quantity === 0 ? () => {} : props.onChangeQuantity
                  }
                />
              </div>
            )}
            <p styleName="stock">{t.remainingStock}</p>
            <span
              styleName={classNames('inStock', {
                zeroQuantity: props.quantity === 0,
              })}
            >
              {`${t.inStock} (${numberToWords(props.quantity)})`}
            </span>
          </div>
        </Fragment>
      )}

      {isPreOrderAvailable && (
        <div styleName="preOrder">
          <div styleName="title">
            <strong>{t.preOrder}</strong>
          </div>
          <div styleName="preOrderText">
            <div>{t.availableForPreOrder}</div>
            <div>
              {t.leadTime}{' '}
              <span styleName="preOrderDays">{props.preOrderDays}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductQuantity;
