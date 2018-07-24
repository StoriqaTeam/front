// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import Facebook from './svg/logo-facebook.svg';
import Pinterest from './svg/logo-pinterest.svg';
import Twitter from './svg/logo-twitter.svg';
// import Instagram from './svg/logo-instagram.svg';
import VK from './svg/logo-vk.svg';
import HeartIcon from './svg/heart.svg';

import './SocialShare.scss';

type PropsType = {
  photoMain: string,
  description: string,
  big: boolean,
};

class SocialShare extends Component<PropsType> {
  static defaultProps = {
    big: false,
  };
  handleShare = () => {};
  render() {
    const { photoMain, description, big } = this.props;
    const { href } = window.location;
    const url = window.encodeURIComponent(href);
    // const url = 'https://nightly.stq.cloud/store/129/products/468';
    return (
      <nav styleName={classNames('container', { big })}>
        <ul styleName={classNames('socialIcons', { big })}>
          <li styleName="linkContainer">
            <a
              styleName="link"
              rel="noopener noreferrer"
              target="_blank"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url};src=sdkpreparse`}
            >
              <Facebook />
            </a>
          </li>
          <li styleName="linkContainer">
            <a
              data-pin-do="buttonBookmark"
              data-pin-custom="true"
              styleName="link"
              rel="noopener noreferrer"
              target="_blank"
              href={`https://www.pinterest.com/pin/create/button/?url=${photoMain}&description=${description}`}
            >
              <Pinterest />
            </a>
          </li>
          <li styleName="linkContainer">
            <a
              styleName="link"
              rel="noopener noreferrer"
              target="_blank"
              href={`https://twitter.com/intent/tweet?url=${url}&text=${description}`}
            >
              <Twitter />
            </a>
          </li>
          {/* <Instagram /> */}
          <li styleName="linkContainer">
            <a
              styleName="link"
              rel="noopener noreferrer"
              target="_blank"
              href={`http://vk.com/share.php?url=${url}`}
            >
              <VK />
            </a>
          </li>
        </ul>
        <div styleName={classNames('favorite', { big })}>
          <HeartIcon />
        </div>
      </nav>
    );
  }
}

export default SocialShare;
