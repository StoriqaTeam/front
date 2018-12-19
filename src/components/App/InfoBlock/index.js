// @flow strict

import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import type { IconSizeType } from 'types';

// import t from './i18n';

import './InfoBlock.scss';

type StateType = {
  social: Array<{
    id: string,
    type: string,
    size: IconSizeType,
    href: string,
  }>,
  // links: Array<{
  //   id: string,
  //   href: string,
  //   name: string,
  // }>,
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
        type: 'mediumGray',
        size: 32,
        href: 'https://medium.com/storiqa',
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
        type: 'redditGray',
        size: 32,
        href: 'https://www.reddit.com/r/Storiqa/',
      },
    ],
    // links: [
    //   {
    //     id: '0',
    //     href: '/',
    //     name: t.aboutStoriqa,
    //   },
    //   {
    //     id: '1',
    //     href: '/privacy_policy.pdf',
    //     name: 'Privacy Policy',
    //   },
    //   {
    //     id: '2',
    //     href: '/',
    //     name: t.help,
    //   },
    //   {
    //     id: '3',
    //     href: '/terms_of_use.pdf',
    //     name: 'Terms of Use',
    //   },
    // ],
  };
  render() {
    const { social } = this.state;
    return (
      <div styleName="container">
        {/*
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
        */}
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
