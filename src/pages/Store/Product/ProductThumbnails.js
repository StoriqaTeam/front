// @flow

import React, { Component } from 'react';

import './ProductThumbnails.scss';

type propsTypes = {
  thumbnails: {img: string, alt: string}[],
}

type stateTypes = {
  isClicked: number
}

class ProductThumbnails extends Component<propsTypes, stateTypes> {
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
    const { thumbnails } = this.props;
    const { clicked } = this.state;
    return (
      <div styleName="container">
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
    );
  }
}

export default ProductThumbnails;
