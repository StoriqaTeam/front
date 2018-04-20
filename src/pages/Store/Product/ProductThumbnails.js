// @flow

import React, { Component } from 'react';

import './ProductThumbnails.scss';

type PropsType = {
  title?: string,
  thumbnails: Array<{img: string, alt: string, label?: string}>,
  row?: boolean,
  onClick: Function,
}

type StateType = {
  isClicked: number
}

class ProductThumbnails extends Component<PropsType, StateType> {
  static defaultProps = {
    title: '',
    row: false,
  };
  state = {
    clicked: null,
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
      clicked: index,
    }, onClick(thumbnail));
  };
  render() {
    const {
      thumbnails,
      row,
      title,
    } = this.props;
    const { clicked } = this.state;
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
                  styleName={clicked === index ? 'clicked' : ''}
                  src={thumbnail.img}
                  alt={thumbnail.label || 'something'}
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
