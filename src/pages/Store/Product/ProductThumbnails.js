// @flow

import React, { Component } from 'react';

import './ProductThumbnails.scss';

type propsTypes = {
  title: string,
  thumbnails: {img: string, alt: string}[],
  row: boolean,
}

type stateTypes = {
  isClicked: number
}

class ProductThumbnails extends Component<propsTypes, stateTypes> {
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
   * @return {void}
   */
  handleClick = (index: number): void => {
    this.setState({
      clicked: index,
    });
  };
  render() {
    const { thumbnails, row, title } = this.props;
    const { clicked } = this.state;
    return (
      <div styleName="container">
        { title !== '' ? (<h4>{ title }</h4>) : null }
        <div styleName={`thumbnails ${row ? 'row' : 'column'}`}>
          {thumbnails.map(({ id, src, alt }, index) => (
            <button
              key={id}
              onClick={() => this.handleClick(index)}
            >
              <figure>
                <img
                  styleName={clicked === index ? 'clicked' : ''}
                  src={src}
                  alt={alt}
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
