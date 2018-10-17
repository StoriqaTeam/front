// @flow strict

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

import Facebook from './svg/logo-facebook.svg';
import Pinterest from './svg/logo-pinterest.svg';
import Twitter from './svg/logo-twitter.svg';
import Instagram from './svg/logo-instagram.svg';
import VK from './svg/logo-vk.svg';
import HeartIcon from './svg/heart.svg';

import './SocialShare.scss';

type PropsType = {
  big: boolean,
  noBorder: boolean,
  noBorderX: boolean,
  facebookUrl?: string,
  pinterestUrl?: string,
  twitterUrl?: string,
  instagramUrl?: string,
  vkontakteUrl?: string,
};

class SocialShare extends Component<PropsType> {
  static defaultProps = {
    big: false,
    noBorder: false,
    noBorderX: false,
  };
  handleShare = () => {};
  render() {
    const {
      big,
      noBorder,
      noBorderX,
      facebookUrl,
      pinterestUrl,
      twitterUrl,
      instagramUrl,
      vkontakteUrl,
    } = this.props;
    return (
      <nav styleName={classNames('container', { big, noBorder, noBorderX })}>
        <div styleName={classNames('socialIcons', { big })}>
          <Fragment>
            {Boolean(facebookUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={facebookUrl}
              >
                <Facebook />
              </a>
            )}
            {Boolean(pinterestUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={pinterestUrl}
              >
                <Pinterest />
              </a>
            )}
            {Boolean(twitterUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={twitterUrl}
              >
                <Twitter />
              </a>
            )}
            {Boolean(instagramUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={instagramUrl}
              >
                <Instagram />
              </a>
            )}
            {Boolean(vkontakteUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={vkontakteUrl}
              >
                <VK />
              </a>
            )}
          </Fragment>
        </div>
        {!noBorder && (
          <div styleName={classNames('favorite', { big, noBorder })}>
            <HeartIcon />
          </div>
        )}
      </nav>
    );
  }
}

export default SocialShare;
