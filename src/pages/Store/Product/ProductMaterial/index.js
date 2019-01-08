// @flow

import React, { Component } from 'react';
import { isNil, sortBy, prop, map, filter, contains } from 'ramda';
import classNames from 'classnames';

import { Select } from 'components/common/Select';

import type { SelectItemType } from 'types';

import './ProductMaterial.scss';

import type { WidgetOptionType } from '../types';

type MaterialType = { id: string | number, label: string };

type PropsType = {
  id: string,
  title: string,
  options: Array<MaterialType>,
  onSelect: ({
    attributeId: string,
    attributeValue: string,
  }) => void,
  selectedValue: ?string,
  isOnSelected: boolean,
  availableValues: Array<string>,
};

type StateType = {
  selected: WidgetOptionType | null,
};

class ProductMaterial extends Component<PropsType, StateType> {
  handleSelect = (selected: SelectItemType): void => {
    const { selectedValue } = this.props;
    if (!selected.id) {
      if (!selectedValue) {
        return;
      }
      this.props.onSelect({
        attributeId: this.props.id,
        attributeValue: selectedValue,
      });
    } else {
      this.props.onSelect({
        attributeId: this.props.id,
        attributeValue: selected.label,
      });
    }
  };
  render() {
    const { title, options, isOnSelected } = this.props;

    const items = filter(
      item => contains(item.label, this.props.availableValues),
      map(
        item => ({
          id: item.label,
          label: item.label,
        }),
        sortBy(prop('label'), options),
      ),
    );

    const activeItem = this.props.selectedValue
      ? {
          id: this.props.selectedValue,
          label: this.props.selectedValue,
        }
      : { id: 'placeholder', label: 'Choose item' };

    return (
      <div styleName="container">
        <div id={title} styleName={classNames('title', { isOnSelected })}>
          <strong>{title}</strong>
        </div>
        {isNil(options) ? null : (
          <Select
            forForm
            withEmpty
            activeItem={activeItem}
            items={items}
            onSelect={this.handleSelect}
            fullWidth
            dataTest="productMaterialSelect"
          />
        )}
      </div>
    );
  }
}

export default ProductMaterial;
