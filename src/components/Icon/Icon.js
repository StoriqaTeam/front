// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import Person from 'components/Icon/svg/person.svg';
import Cart from 'components/Icon/svg/cart.svg';

type PropsTypes = {
  type: string,
  size: 16 | 32,
};

class Icon extends PureComponent<PropsTypes> {
  render() {
    const { type, size } = this.props;
    const className = classNames(
      'Icon',
      `icon-${type}`,
      `size-${size || '16'}`,
    );

    return (
      <div className={className}>
        {(() => {
          switch (type) {
            case 'person': return <Person />;
            case 'cart': return <Cart />;
            default: return null;
          }
        })()}
      </div>
    );
  }
}

export default Icon;
