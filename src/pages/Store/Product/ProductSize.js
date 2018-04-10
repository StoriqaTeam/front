// @flow

import React, { Component } from 'react';

import './ProductSize.scss';

type PropsType = {
  title: string,
  sizes: string | number[],
}

type StateType = {
  clicked: number
}

class ProductSize extends Component<PropsType, StateType> {
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
    const { title, sizes } = this.props;
    const { clicked } = this.state;
    return (
      <div styleName="container">
        <h4>
          { title }
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
