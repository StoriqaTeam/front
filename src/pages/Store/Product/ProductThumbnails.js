// @flow

import React, { Component } from 'react';

import './ProductThumbnails.scss';

type PropsType = {
  // eslint-disable-next-line
  isReset: boolean,
  title?: string,
  thumbnails: Array<{img: string, alt: string, opacity: boolean, label?: string}>,
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
  };
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
   * Highlights img's border when clicked
   * @param {number} index
   * @param {{}} thumbnail
   * @return {void}
   */
  handleClick = (index: number, thumbnail): void => {
    const { onClick } = this.props;
    this.setState({
      selected: index,
    }, onClick(thumbnail));
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
                  alt={thumbnail.val || 'something'}
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
