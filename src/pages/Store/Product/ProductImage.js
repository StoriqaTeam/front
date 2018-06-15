// @flow

import React, { Component } from 'react';

import { isEmpty } from 'utils';

import { ImageDetail } from './index';

import './ProductImage.scss';

type PropsType = {
  photoMain: string,
  discount: number,
  // eslint-disable-next-line
  selected: string,
};

type StateType = {
  selected: string,
};

class ProductImage extends Component<PropsType, StateType> {
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
    return {
      ...prevState,
      selected: nextProps.selected,
    };
  }
  state = {
    selected: '',
  };
  render() {
    const { photoMain, discount } = this.props;
    const { selected } = this.state;
    return (
      <div styleName="container">
        <figure styleName="imageWrapper">
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
                !isEmpty(selected) ? selected : photoMain
              })`,
              backgroundSize: 'contain',
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
