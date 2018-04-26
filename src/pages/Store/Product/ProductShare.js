// @flow

import React, { Component } from 'react';

import Facebook from './svg/logo-facebook.svg';
import Pinterest from './svg/logo-pinterest.svg';
import Twitter from './svg/logo-twitter.svg';
import Instagram from './svg/logo-instagram.svg';
import VK from './svg/logo-vk.svg';

import './ProductShare.scss';

class ProductShare extends Component<{}> {
  handleShare = () => {};
  render() {
    return (
      <div styleName="container">
        <Facebook />
        <Pinterest />
        <Twitter />
        <Instagram />
        <VK />
      </div>
    );
  }
}

export default ProductShare;
