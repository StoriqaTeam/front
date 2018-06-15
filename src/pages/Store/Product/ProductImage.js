// @flow

import React, { Component } from 'react';

import { isEmpty } from 'utils';

import { ImageDetail } from './index';

import './ProductImage.scss';

// import type { WidgetOptionType } from './types';

type PropsType = {
  mainImage: string,
  discount: number,
};

type StateType = {
  selected: string,
};

class ProductImage extends Component<PropsType, StateType> {
  /**
   * @static
   * @param {PropsType} nextProps
   * @param {StateType} prevState
   * @return {StateType | null}
   */
  static getDerivedStateFromProps(
    nextProps: PropsType,
    prevState: StateType,
  ): StateType | null {
    const { selected } = prevState;
    if (!isEmpty(selected)) {
      return {
        selected: '',
      };
    }
    return prevState;
  }
  state = {
    selected: '',
  };
  render() {
    const { mainImage, discount } = this.props;
    const { selected } = this.state;
    return (
      <div styleName="container">
        <figure styleName="bigImage">
          {discount > 0 ? (
            <span styleName="discount">
              Price <br /> Off <br />
              <span
                style={{
                  fontSize: 16,
                }}
              >
                {`- ${Math.round(discount * 100)} %`}
              </span>
            </span>
          ) : null}
          <div
            role="img"
            style={{
              backgroundImage: `url(${
                !isEmpty(selected) ? selected : mainImage
                })`,
              backgroundSize: 'contain',
              width: '100%',
              height: '100%',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </figure>
        <ImageDetail />
      </div>
    );
  }
}

export default ProductImage;
