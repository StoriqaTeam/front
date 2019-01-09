// @flow strict

import React, { PureComponent } from 'react';
import { map, sortBy, prop, contains } from 'ramda';
import classNames from 'classnames';

import './ProductSize.scss';

import type { WidgetOptionType } from '../types';

type PropsType = {
  title: string,
  id: string,
  options: Array<WidgetOptionType>,
  onClick: ({ attributeId: string, attributeValue: string }) => void,
  selectedValue: ?string,
  isOnSelected: boolean,
  availableValues: Array<string>,
};

class ProductSize extends PureComponent<PropsType> {
  render() {
    const { title, options, isOnSelected } = this.props;
    return (
      <div styleName="container">
        <div id={title} styleName={classNames('title', { isOnSelected })}>
          <strong>{title}</strong>
        </div>
        <div styleName="sizes">
          {map(option => {
            const available = contains(
              option.label,
              this.props.availableValues,
            );
            const separator = () => available;
            return (
              <button
                key={`${option.label}`}
                data-test={`productSize${option.label}`}
                onClick={() => {
                  this.props.onClick({
                    attributeId: this.props.id,
                    attributeValue: option.label,
                  });
                }}
                styleName={`size ${
                  option.label === this.props.selectedValue ? 'clicked' : ''
                } ${!available ? 'disabled' : ''}`}
              >
                {option.label}
                {!available || separator() ? (
                  <span
                    styleName={classNames('separator', {
                      highlighted: option.label === this.props.selectedValue,
                    })}
                  />
                ) : null}
              </button>
            );
          }, sortBy(prop('label'), options))}
        </div>
      </div>
    );
  }
}

export default ProductSize;
