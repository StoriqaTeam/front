// @flow

import React, { Component } from 'react';

import './ProductThumbnails.scss';

import {
  SelectedType,
  ThumbnailType,
} from './types';

type PropsType = {
  /* eslint-disable react/no-unused-prop-types */
  isFirstSelected: boolean,
  isReset: boolean,
  title?: string,
  thumbnails: Array<ThumbnailType>,
  row?: boolean,
  onClick: Function,
}

type StateType = {
  selected: null | number,
}

class ProductThumbnails extends Component<PropsType, StateType> {
  static defaultProps = {
    title: '',
    row: false,
    isFirstSelected: false,
  };
  /**
   * @static
   * @param {PropsType} nextProps
   * @param {StateType} prevState
   * @return {StateType | null}
   */
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType): StateType | null {
    const { isReset, isFirstSelected } = nextProps;
    if (isReset) {
      return {
        selected: isFirstSelected ? 0 : null,
      };
    }
    return prevState;
  }
  state = {
    selected: null,
  };
  /**
   * Highlights img's border when clicked
   * @param {number} index
   * @param {SelectedType} selected
   * @return {void}
   */
  handleClick = (index: number, selected: SelectedType): void => {
    const { onClick } = this.props;
    this.setState({
      selected: index,
    }, onClick(selected));
  };
  render() {
    const {
      thumbnails,
      row,
      title,
    } = this.props;
    const { selected } = this.state;
    return (
      <div styleName="container">
        { title !== '' ? (<h4>{ title }</h4>) : null }
        <div styleName={`thumbnails ${row ? 'row' : 'column'}`}>
          {thumbnails.map((thumbnail, index) => (
            <button
              key={thumbnail.id}
              onClick={() => this.handleClick(index, thumbnail)}
            >
              <figure>
                <img
                  styleName={`${selected === index && !thumbnail.opacity ? 'clicked' : ''} ${thumbnail.opacity ? 'opaque' : ''}`}
                  src={thumbnail.img}
                  alt={thumbnail.alt || 'image alt'}
                />
              </figure>
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductThumbnails;
