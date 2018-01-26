// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { pathOr } from 'ramda';

import Person from 'components/Icon/svg/person.svg';
import Cart from 'components/Icon/svg/cart.svg';
import QA from 'components/Icon/svg/qa.svg';
import Prev from 'components/Icon/svg/prev.svg';
import Next from 'components/Icon/svg/next.svg';

import './Icon.scss';

type PropsTypes = {
  type: string,
  size: 16 | 24 | 32,
};

const iconsMap = {
  person: <Person />,
  cart: <Cart />,
  qa: <QA />,
  prev: <Prev />,
  next: <Next />,
};

class Icon extends PureComponent<PropsTypes> {
  render() {
    const { type, size } = this.props;
    const className = classNames('container', `size-${size || '16'}`);

    return (
      <div styleName={className}>
        {pathOr(null, [type], iconsMap)}
      </div>
    );
  }
}

export default Icon;
