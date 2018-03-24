// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

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
import FacebookG from 'components/Icon/svg/facebook_g.svg';
import PinterestG from 'components/Icon/svg/pinterest_g.svg';
import TwitterG from 'components/Icon/svg/twitter_g.svg';
import InstagramG from 'components/Icon/svg/instagram_g.svg';
import VkG from 'components/Icon/svg/vk_g.svg';
import Spiner from 'components/Icon/svg/spiner.svg';
import ArrowExpand from 'components/Icon/svg/arrowExpand.svg';
import ArrowSelect from 'components/Icon/svg/arrowSelect.svg';
import ArrowRight from 'components/Icon/svg/arrowRight.svg';
import Cross from 'components/Icon/svg/cross.svg';
import Pencil from 'components/Icon/svg/pencil.svg';

import './Icon.scss';

type PropsTypes = {
  type: string,
  size: 8 | 16 | 24 | 32,
};

const iconsMap = {
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
  facebookG: <FacebookG />,
  pinterestG: <PinterestG />,
  twitterG: <TwitterG />,
  instagramG: <InstagramG />,
  vkG: <VkG />,
  spiner: <Spiner />,
  arrowExpand: <ArrowExpand />,
  arrowSelect: <ArrowSelect />,
  arrowRight: <ArrowRight />,
  cross: <Cross />,
  pencil: <Pencil />,
};

class Icon extends PureComponent<PropsTypes> {
  render() {
    const { type, size } = this.props;

    return (
      <div styleName={`container size-${size || '16'}`}>
        {pathOr(null, [type], iconsMap)}
      </div>
    );
  }
}

export default Icon;
