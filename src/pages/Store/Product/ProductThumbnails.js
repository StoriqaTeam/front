// @flow

import React, { Component } from 'react';

import { has } from 'utils';

import './ProductThumbnails.scss';

type PropsType = {
  title: string,
  thumbnails: {img: string, alt: string}[],
  row: boolean,
  onClick: Function,
  srcProp?: string,
}

type StateType = {
  isClicked: number
}

class ProductThumbnails extends Component<PropsType, StateType> {
  static defaultProps = {
    title: '',
    row: false,
    onClick: () => {},
    srcProp: 'src', // THIS is to point object's property that contains image url
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
    const {
      thumbnails,
      row,
      title,
      srcProp,
    } = this.props;
    const { clicked } = this.state;
    return (
      <div styleName="container">
        { title !== '' ? (<h4>{ title }</h4>) : null }
        <div styleName={`thumbnails ${row ? 'row' : 'column'}`}>
          {thumbnails.map((thumbnail, index) => (
            <button
              key={has(thumbnail, 'id') ? thumbnail.id : index}
              onClick={() => this.handleClick(index, {
                src: thumbnail[srcProp],
                alt: thumbnail.label || 'storiqa',
              })}
            >
              <figure>
                <img
                  styleName={clicked === index ? 'clicked' : ''}
                  src={thumbnail[srcProp]}
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
