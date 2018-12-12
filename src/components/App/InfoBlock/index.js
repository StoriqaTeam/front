// @flow strict

import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import type { IconSizeType } from 'types';

import t from './i18n';

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
        name: t.aboutStoriqa,
      },
      {
        id: '1',
        href: '/privacy_policy.pdf',
        name: t.privacyPolicy,
      },
      {
        id: '2',
        href: '/',
        name: t.help,
      },
      {
        id: '3',
        href: '/terms_of_use.pdf',
        name: t.termsOfUse,
      },
      {
        id: '4',
        href:
          'https://s3.eu-west-2.amazonaws.com/storiqa.com/Prohibited+or+suspicious+goods+and+services.pdf',
        name: t.prohibitedGoods,
      },
    ],
  };
  render() {
    const { social, links } = this.state;
    return (
      <div styleName="container">
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
