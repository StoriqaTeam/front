import React, { Component } from 'react';

import { Icon } from 'components/Icon';
import { Row, Col } from 'layout';

import './InfoBlock.scss';

class InfoBlock extends Component {
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
        type: 'twitterGray',
        size: 32,
        href: 'https://twitter.com/storiqa',
      },
      {
        id: '2',
        type: 'instagramGray',
        size: 32,
        href: 'https://www.instagram.com/storiqa',
      },
    ],
    links: [
      {
        id: '0',
        href: '/',
        name: 'About Storiqa'
      },
      {
        id: '1',
        href: '/',
        name: 'Privacy Policy'
      },
      {
        id: '2',
        href: '/',
        name: 'Help'
      },
      {
        id: '3',
        href: '/',
        name: 'Conditions of use'
      },

    ]
  };
  render() {
    const { social, links } = this.state;
    return (
      <div styleName="container">
        <div styleName="address">
          Unit 617, 6/F, 131-132 Connaught Road West, Hong Kong
        </div>
        <a href="mailto:support@storiqa.com" styleName="email">
          support@storiqa.com
        </a>
        <div styleName="aboutNavBlock">
          {links.map(({ id, href, name }) => (
            <div key={id} styleName="aboutNavItem">
              <a href={href}>{ name }</a>
            </div>
          ))}
        </div>
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
