// @flow

import React, { PureComponent } from 'react';
import { map, addIndex } from 'ramda';

import './ProductSize.scss';

type PropsType = {
  title: string,
  sizes: Array<{id: string, label: string, opacity: boolean, img?: string}>,
  onClick: Function,
  isReset: boolean,
}

type StateType = {
  selected: null | number
}

class ProductSize extends PureComponent<PropsType, StateType> {
  /**
   * @static
   * @param {PropsType} nextProps
   * @param {StateType} prevState
   * @return {StateType | null}
   */
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType): StateType | null {
    const { isReset } = nextProps;
    if (isReset) {
      return {
        selected: null,
      };
    }
    return prevState;
  }
  state = {
    selected: null,
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
      selected: index,
    }, () => onClick(item));
  };
  render() {
    const { title, sizes } = this.props;
    const { selected } = this.state;
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
              styleName={`size ${selected === index ? 'clicked' : ''} ${size.opacity ? 'opaque' : ''}`}
            >
              { size.label }
            </button>
          ), sizes)}
        </div>
      </div>
    );
  }
}

export default ProductSize;
