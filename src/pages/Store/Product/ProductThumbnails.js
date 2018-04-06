// @flow

import React, { Component } from 'react';

import './ProductThumbnails.scss';

type propsTypes = {
  title: string,
  thumbnails: {img: string, alt: string}[],
  row: boolean,
  onClick: Function,
}

type stateTypes = {
  isClicked: number
}

class ProductThumbnails extends Component<propsTypes, stateTypes> {
  static defaultProps = {
    title: '',
    row: false,
    onClick: () => {},
  };
  state = {
    clicked: null,
  };
  /**
   * Highlights img's border when clicked
   * @param {number} index
   * @param {{src: string, alt: string }} img
   * @return {void}
   */
  handleClick = (index: number, img): void => {
    const { onClick } = this.props;
    this.setState({
      clicked: index,
    }, onClick(img));
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
              onClick={() => this.handleClick(index, { src, alt })}
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
