import React, { Component } from 'react';

import { Icon } from 'components/Icon';

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
  };
  render() {
    const { social } = this.state;
    return (
      <div styleName="container">
        <div styleName="address">
          Unit 617, 6/F, 131-132 Connaught Road West, Hong Kong
        </div>
        <a href="mailto:support@storiqa.com" styleName="email">
          support@storiqa.com
        </a>
        <div styleName="aboutNavBlock">
          <div styleName="aboutNavItem">
            <a href="/">About Storiqa</a>
          </div>
          <div styleName="aboutNavItem">
            <a href="/">Privacy Policy</a>
          </div>
          <div styleName="aboutNavItem">
            <a href="/">Help</a>
          </div>
          <div styleName="aboutNavItem">
            <a href="/">Conditions of use</a>
          </div>
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
