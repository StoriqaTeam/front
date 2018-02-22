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
import Spiner from 'components/Icon/svg/spiner.svg';
import ArrowExpand from 'components/Icon/svg/arrowExpand.svg';
import ArrowsExpand from 'components/Icon/svg/arrowsExpand.svg';

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
  spiner: <Spiner />,
  arrowExpand: <ArrowExpand />,
  arrowsExpand: <ArrowsExpand />,
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
