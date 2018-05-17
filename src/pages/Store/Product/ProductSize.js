// @flow

import React, { PureComponent } from 'react';
import { map, addIndex, isNil, propEq } from 'ramda';

import './ProductSize.scss';

import { SelectedType } from './types';

type PropsType = {
  // isReset: boolean,
  title: string,
  sizes: Array<{ id: string, label: string, opacity: boolean, img?: string }>,
  onClick: Function,
};

type StateType = {
  selected: null | number,
};

class ProductSize extends PureComponent<PropsType, StateType> {
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
    return prevState;
  }
  state = {
    selected: null,
  };
  /**
   * Highlights size's border when clicked
   * @param {number} index
   * @param {SelectedType} selected
   * @return {void}
   */
  handleClick = (index: number, selected: SelectedType): void => {
    const { onClick } = this.props;
    this.setState(
      {
        selected: index,
      },
      () => onClick({ ...selected, state: 'selected ' }),
    );
  };
  render() {
    const { title, sizes } = this.props;
    const { selected } = this.state;
    const mapIndexed = addIndex(map);
    return (
      <div styleName="container">
        <h4>{title}</h4>
        <pre>{JSON.stringify(sizes, null, 2)}</pre>
        <div styleName="sizes">
          {mapIndexed((size, index, arr) => {
            const isntOpacity = propEq('opacity', false);
            const opacities = arr.every(isntOpacity);
            const separator = () => !isNil(arr[index]) && !arr[index].opacity;
            return (
              <button
                key={`${size.label}`}
                onClick={() => this.handleClick(index, size)}
                styleName={`size ${
                  selected === index && !size.opacity ? 'clicked' : ''
                } ${size.opacity ? 'opaque' : ''}`}
              >
                {size.label}
                {!opacities && isNil(selected) && separator() ? (
                  <span styleName="separator" />
                ) : null}
              </button>
            );
          }, sizes)}
        </div>
      </div>
    );
  }
}

export default ProductSize;
