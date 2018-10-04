// @flow strict

import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import type { IconSizeType } from 'types';

import './InfoBlock.scss';

type StateType = {
  social: Array<{
    id: string,
    type: string,
    size: IconSizeType,
    href: string,
  }>,
  links: Array<{
    id: string,
    href: string,
    name: string,
  }>,
};

class InfoBlock extends Component<{}, StateType> {
  state = {
    social: [
      {
        id: '0',
        type: 'facebookGray',
        size: 32,
        href: 'https://www.facebook.com/storiqa',
      },
      {
        id: '1',
        type: 'pinterestGray',
        size: 32,
        href: 'https://www.pinterest.com/storiqa',
      },
      {
        id: '2',
        type: 'twitterGray',
        size: 32,
        href: 'https://twitter.com/storiqa',
      },
      {
        id: '3',
        type: 'instagramGray',
        size: 32,
        href: 'https://www.instagram.com/storiqa',
      },
      {
        id: '4',
        type: 'vkGray',
        size: 32,
        href: 'https://vk.com/storiqa',
      },
    ],
    links: [
      {
        id: '0',
        href: '/',
        name: 'About Storiqa',
      },
      {
        id: '1',
        href: 'https://beta.storiqa.com/privacy_policy.pdf',
        name: 'Privacy Policy',
      },
      {
        id: '2',
        href: '/',
        name: 'Help',
      },
      {
        id: '3',
        href: 'https://beta.storiqa.com/terms_of_use.pdf',
        name: 'Terms of Use',
      },
    ],
  };
  render() {
    const { social, links } = this.state;
    return (
      <div styleName="container">
        <p styleName="address">
          Head Office Unit 617, 6/F 131-132 Connaught Road West Hong Kong{' '}
          <span>
            <a href="mailto:support@storiqa.com" styleName="email">
              support@storiqa.com
            </a>
          </span>
        </p>
        <ul styleName="aboutNavBlock">
          {links.map(({ id, href, name }) => (
            <li key={id} styleName="aboutNavItem">
              <a
                styleName="link"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
        <div styleName="icons">
          {social.map(({ id, href, size, type }) => (
            <a key={id} href={href} target="_blank" rel="noopener noreferrer">
              <Icon type={type} size={size} />
            </a>
          ))}
        </div>
      </div>
    );
  }
}

export default InfoBlock;
