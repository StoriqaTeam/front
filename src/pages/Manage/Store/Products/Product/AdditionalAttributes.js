// @flow strict

import React, { Component } from 'react';
import { filter, find, propEq, isEmpty, map } from 'ramda';
import classNames from 'classnames';

import { getNameText } from 'utils';

import { Icon } from 'components/Icon';
import { Select } from 'components/common';

import type { SelectItemType } from 'types';

import './AdditionalAttributes.scss';

type AttributeType = {
  id: string,
  rawId: number,
  name: {
    lang: string,
    text: string,
  },
};

type PropsType = {
  attributes: Array<AttributeType>,
  categoryAttributes: Array<AttributeType>,
  baseProductCategoryAttributes: Array<AttributeType>,
  onCreateAttribute: (attributeId: number) => void,
  onDeleteAttribute: (attributeId: number) => void,
  customAttributes: Array<{
    id: string,
    rawId: number,
    attribute: AttributeType,
  }>,
};

type StateType = {
  defaultAttributes: Array<SelectItemType>,
  activeAttribute: ?SelectItemType,
  selectableAttributes: Array<SelectItemType>,
  selectedAttributes: Array<SelectItemType>,
};

class AdditionalAttributes extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = this.recalculationState();
  }

  componentDidUpdate(prevProps: PropsType) {
    if (
      JSON.stringify(prevProps.customAttributes) !==
      JSON.stringify(this.props.customAttributes)
    ) {
      this.updateState();
    }
  }

  updateState = () => {
    this.setState(this.recalculationState());
  };

  recalculationState = () => {
    const {
      attributes,
      categoryAttributes,
      baseProductCategoryAttributes,
      customAttributes,
    } = this.props;
    console.log('---attributes', attributes);

    const filteredAttributes = filter(
      item =>
        !find(propEq('rawId', item.rawId))(
          (!isEmpty(categoryAttributes) ? categoryAttributes : false) ||
            (!isEmpty(baseProductCategoryAttributes)
              ? baseProductCategoryAttributes
              : []),
        ),
      attributes,
    );
    const selectableAttributes = filter(
      item =>
        !find(propEq('rawId', parseInt(item.id, 10)))(
          map(
            attributeItem => ({ ...attributeItem.attribute }),
            customAttributes,
          ),
        ),
      map(
        item => ({ id: `${item.rawId}`, label: getNameText(item.name, 'EN') }),
        filteredAttributes,
      ),
    );

    return {
      defaultAttributes: map(
        item => ({ id: `${item.rawId}`, label: getNameText(item.name, 'EN') }),
        filteredAttributes,
      ),
      selectableAttributes,
      activeAttribute: null,
      selectedAttributes: map(
        item => ({
          id: `${item.attribute.rawId}`,
          label: getNameText(item.attribute.name, 'EN'),
        }),
        customAttributes,
      ),
    };
  };

  handleOnSelect = (activeAttribute: ?SelectItemType) => {
    this.setState({ activeAttribute });
  };

  handleAddAttribute = () => {
    if (this.state.activeAttribute) {
      this.props.onCreateAttribute(parseInt(this.state.activeAttribute.id, 10));
    }
  };

  handleRemoveAttribute = (attribute: SelectItemType) => {
    const customAttributes = map(
      item => ({ id: item.rawId, attributeId: `${item.attribute.rawId}` }),
      this.props.customAttributes,
    );
    const removableAttribute = find(propEq('attributeId', attribute.id))(
      customAttributes,
    );

    if (removableAttribute) {
      this.props.onDeleteAttribute(removableAttribute.id);
    }
  };

  render() {
    const {
      selectableAttributes,
      activeAttribute,
      selectedAttributes,
    } = this.state;
    console.log('---selectableAttributes', selectableAttributes);
    return (
      <div styleName="container">
        <div
          styleName={classNames('select', {
            hidePlane: isEmpty(selectableAttributes),
          })}
        >
          <Select
            forForm
            label="Additional characteristics"
            activeItem={activeAttribute}
            items={selectableAttributes}
            onSelect={this.handleOnSelect}
            dataTest="productCurrencySelect"
            fullWidth
          />
        </div>
        {activeAttribute && (
          <button styleName="button" onClick={this.handleAddAttribute}>
            <div styleName="buttonIcon">
              <Icon inline type="plus" size={20} />
            </div>
            <div styleName="buttonText">Add</div>
          </button>
        )}
        <div styleName="selectedAttributes">
          {map(
            item => (
              <div key={item.id} styleName="attribute">
                <div styleName="label">{item.label}</div>
                <button
                  styleName="cross"
                  onClick={() => {
                    this.handleRemoveAttribute(item);
                  }}
                >
                  <Icon inline type="cross" size={12} />
                </button>
              </div>
            ),
            selectedAttributes,
          )}
        </div>
      </div>
    );
  }
}

export default AdditionalAttributes;
