// @flow

import React, { Component } from 'react';

import './ProductSize.scss';

type PropsType = {
  title: string,
  sizes: {id: string, label: string}[],
  sizeProp: string,
  onClick: Function,
}

type StateType = {
  clicked: number
}

class ProductSize extends Component<PropsType, StateType> {
  static defaultProps = {
    sizeProp: 'label',
  };
  state = {
    clicked: null,
  };
  /**
   * Highlights size's border when clicked
   * @param {number} index
   * @param {{}} item
   * @return {void}
   */
  handleClick = (index: number, item): void => {
    /* eslint-disable no-console */
    console.log('item', item);
    const { onClick } = this.props;
    this.setState({
      clicked: index,
    }, () => onClick(item));
  };
  render() {
    const { title, sizes, sizeProp } = this.props;
    const { clicked } = this.state;
    return (
      <div styleName="container">
        <h4>
          { title }
        </h4>
        <div styleName="sizes">
          {sizes.map((size, index) => (
            <button
              key={size.id}
              onClick={() => this.handleClick(index, size)}
              styleName={`size ${clicked === index ? 'clicked' : ''}`}
            >
              { size[sizeProp] }
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductSize;
