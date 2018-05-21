// @flow

import React, { Component } from 'react';

import Facebook from './svg/logo-facebook.svg';
import Pinterest from './svg/logo-pinterest.svg';
import Twitter from './svg/logo-twitter.svg';
// import Instagram from './svg/logo-instagram.svg';
import VK from './svg/logo-vk.svg';
import HeartIcon from './svg/heart.svg';

import './ProductShare.scss';

type PropsType = {
  photoMain: string,
  description: string,
};

class ProductShare extends Component<PropsType> {
  handleShare = () => {};
  render() {
    const { photoMain, description } = this.props;
    const { href } = window.location;
    const url = window.encodeURIComponent(href);
    // const url = 'https://nightly.stq.cloud/store/129/products/468';
    return (
      <div styleName="container">
        <div styleName="socialIcons">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.facebook.com/sharer/sharer.php?u=${url};src=sdkpreparse`}
          >
            <Facebook />
          </a>
          <a
            data-pin-do="buttonBookmark"
            data-pin-custom="true"
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.pinterest.com/pin/create/button/?url=${photoMain}&description=${description}`}
          >
            <Pinterest />
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://twitter.com/intent/tweet?url=${url}&text=${description}`}
          >
            <Twitter />
          </a>
          {/* <Instagram /> */}
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`http://vk.com/share.php?url=${url}`}
          >
            <VK />
          </a>
        </div>
        <div styleName="favorite">
          <HeartIcon />
        </div>
      </div>
    );
  }
}

export default ProductShare;
