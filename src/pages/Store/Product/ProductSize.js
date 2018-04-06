// @flow

import React, { Component } from 'react';

import './ProductSize.scss';

type propTypes = {
  sizes: string | number[],
}

type stateTypes = {
  clicked: number
}

class ProductSize extends Component<propTypes, stateTypes> {
  state = {
    clicked: null,
  };
  /**
   * Highlights size's border when clicked
   * @param {number} index
   * @return {void}
   */
  handleClick = (index: number): void => {
    this.setState({
      clicked: index,
    });
  };
  render() {
    const { sizes } = this.props;
    const { clicked } = this.state;
    return (
      <div styleName="container">
        <h4>
          Размер
        </h4>
        <div styleName="sizes">
          {sizes.map((size, index) => (
            /* eslint-disable react/no-array-index-key */
            <button
              key={index}
              onClick={() => this.handleClick(index)}
              styleName={`size ${clicked === index ? 'clicked' : ''}`}
            >
              { size }
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductSize;
