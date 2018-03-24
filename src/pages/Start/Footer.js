// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { find, propEq } from 'ramda';

import { Icon } from 'components/Icon';

import './Footer.scss';

type PropsType = {
  //
}

class Footer extends Component<PropsType> {
  render() {
    return (
      <div styleName="container">
        <div styleName="navBlock">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div styleName="infoBlock">
          <div></div>
          <div></div>
          <div>
            <Icon type="facebookG" size="32" />
            <Icon type="pinterestG" size="32" />
            <Icon type="twitterG" size="32" />
            <Icon type="instagramG" size="32" />
            <Icon type="vkG" size="32" />
          </div>
        </div>
        <div styleName="rightsBlock">© Storiqa Marketplace. All rights reserved. 2018</div>
      </div>
    );
  }
}

export default Footer;
