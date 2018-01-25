// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

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

class Icon extends PureComponent<PropsTypes> {
  render() {
    const { type, size } = this.props;
    const className = classNames('container', `size-${size || '16'}`);

    return (
      <div styleName={className}>
        {(() => {
          switch (type) {
            case 'person': return <Person />;
            case 'cart': return <Cart />;
            case 'qa': return <QA />;
            case 'prev': return <Prev />;
            case 'next': return <Next />;
            default: return null;
          }
        })()}
      </div>
    );
  }
}

export default Icon;
