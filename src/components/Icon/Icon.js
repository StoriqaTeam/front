// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';
import classNames from 'classnames';

import Logo from 'components/Icon/svg/logo.svg';
import Person from 'components/Icon/svg/person.svg';
import Cart from 'components/Icon/svg/cart.svg';
import QA from 'components/Icon/svg/qa.svg';
import Prev from 'components/Icon/svg/prev.svg';
import Next from 'components/Icon/svg/next.svg';
import Eye from 'components/Icon/svg/eye.svg';
import EyeBlue from 'components/Icon/svg/eyeBlue.svg';
import Facebook from 'components/Icon/svg/facebook.svg';
import Google from 'components/Icon/svg/google.svg';
import Instagram from 'components/Icon/svg/instagram.svg';
import Twitter from 'components/Icon/svg/twitter.svg';
import FacebookGray from 'components/Icon/svg/facebook_gray.svg';
import PinterestGray from 'components/Icon/svg/pinterest_gray.svg';
import TwitterGray from 'components/Icon/svg/twitter_gray.svg';
import InstagramGray from 'components/Icon/svg/instagram_gray.svg';
import VkGray from 'components/Icon/svg/vk_gray.svg';
import Spiner from 'components/Icon/svg/spiner.svg';
import ArrowExpand from 'components/Icon/svg/arrowExpand.svg';
import ArrowSelect from 'components/Icon/svg/arrowSelect.svg';
import ArrowRight from 'components/Icon/svg/arrowRight.svg';
import Cross from 'components/Icon/svg/cross.svg';
import Pencil from 'components/Icon/svg/pencil.svg';
import Magnifier from 'components/Icon/svg/magnifier.svg';
import QualityAssurance from 'components/Icon/svg/quality_assurance.svg';
import Camera from 'components/Icon/svg/camera.svg';
import Heart from 'components/Icon/svg/heart.svg';

import './Icon.scss';

type PropsTypes = {
  type: string,
  size: 8 | 16 | 24 | 32,
};

const iconsMap = {
  logo: <Logo />,
  person: <Person />,
  cart: <Cart />,
  qa: <QA />,
  prev: <Prev />,
  next: <Next />,
  eye: <Eye />,
  eyeBlue: <EyeBlue />,
  facebook: <Facebook />,
  google: <Google />,
  instagram: <Instagram />,
  twitter: <Twitter />,
  facebookGray: <FacebookGray />,
  pinterestGray: <PinterestGray />,
  twitterGray: <TwitterGray />,
  instagramGray: <InstagramGray />,
  vkGray: <VkGray />,
  spiner: <Spiner />,
  arrowExpand: <ArrowExpand />,
  arrowSelect: <ArrowSelect />,
  arrowRight: <ArrowRight />,
  cross: <Cross />,
  pencil: <Pencil />,
  magnifier: <Magnifier />,
  qualityAssurance: <QualityAssurance />,
  camera: <Camera />,
  heart: <Heart />,
};

class Icon extends PureComponent<PropsTypes> {
  render() {
    const { type, size } = this.props;
    return (
      <div
        styleName={classNames('container', {
          [`size-${size || '16'}`]: type !== 'logo',
          isLogo: type === 'logo',
        })}
      >
        {pathOr(null, [type], iconsMap)}
      </div>
    );
  }
}

export default Icon;
