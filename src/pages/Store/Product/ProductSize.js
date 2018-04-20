// @flow

import React, { Component } from 'react';
import { map, addIndex } from 'ramda';

import './ProductSize.scss';

type PropsType = {
  title: string,
  sizes: Array<{id: string, label: string}>,
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
    const { onClick } = this.props;
    this.setState({
      clicked: index,
    }, () => onClick(item));
  };
  render() {
    const { title, sizes, sizeProp } = this.props;
    const { clicked } = this.state;
    const mapIndexed = addIndex(map);
    return (
      <div styleName="container">
        <h4>
          { title }
        </h4>
        <div styleName="sizes">
          {mapIndexed((size, index) => (
            <button
              key={size.id}
              onClick={() => this.handleClick(index, size)}
              styleName={`size ${clicked === index ? 'clicked' : ''} ${size.opacity ? 'opaque' : ''}`}
            >
              { size[sizeProp] }
            </button>
          ), sizes)}
        </div>
      </div>
    );
  }
}

export default ProductSize;
