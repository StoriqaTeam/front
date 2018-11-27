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

  convertUrl = (url: string, type: 'fb' | 'in' | 'tw' | null) => {
    switch (type) {
      case 'fb':
        if (url.search(/facebook/) === -1) {
          const newUrl = `facebook.com/${url}`.replace(/\/\//g, '/');
          return `https://${newUrl}`;
        }
        break;
      case 'in':
        if (url.search(/instagram/) === -1) {
          const newUrl = `instagram.com/${url}`.replace(/\/\//g, '/');
          return `https://${newUrl}`;
        }
        break;
      case 'tw':
        if (url.search(/twitter/) === -1) {
          const newUrl = `twitter.com/${url}`.replace(/\/\//g, '/');
          return `https://${newUrl}`;
        }
        break;
      default:
        break;
    }
    if (url.search(/^https?/) === -1) {
      return `https://${url}`;
    }
    return url;
  };

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
                href={this.convertUrl(facebookUrl || '', 'fb')}
              >
                <Facebook />
              </a>
            )}
            {Boolean(pinterestUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={this.convertUrl(pinterestUrl || '', null)}
              >
                <Pinterest />
              </a>
            )}
            {Boolean(twitterUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={this.convertUrl(twitterUrl || '', 'tw')}
              >
                <Twitter />
              </a>
            )}
            {Boolean(instagramUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={this.convertUrl(instagramUrl || '', 'in')}
              >
                <Instagram />
              </a>
            )}
            {Boolean(vkontakteUrl) && (
              <a
                styleName="link"
                rel="noopener noreferrer"
                target="_blank"
                href={this.convertUrl(vkontakteUrl || '', null)}
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
