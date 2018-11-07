// @flow strict

import React, { Component } from 'react';
import { find, propEq, isEmpty, map, head, difference } from 'ramda';
import classNames from 'classnames';

import { getNameText } from 'utils';

import { Icon } from 'components/Icon';
import { Select } from 'components/common';

import type { SelectItemType } from 'types';
import type { GetAttributeType } from 'pages/Manage/Store/Products/types';

import './AdditionalAttributes.scss';

type PropsType = {
  attributes: Array<GetAttributeType>,
  onCreateAttribute: (attribute: GetAttributeType) => void,
  onRemoveAttribute: (id: string) => void,
  customAttributes: Array<GetAttributeType>,
  onlyView: boolean,
};

type StateType = {
  selectableAttributes: Array<SelectItemType>,
  activeAttribute: ?SelectItemType,
};

class Index extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { attributes } = props;
    const selectableAttributes = this.updateAttributes(attributes);
    const activeAttribute = head(selectableAttributes);
    this.state = {
      selectableAttributes,
      activeAttribute,
    };
  }

  componentDidUpdate(prevProps: PropsType) {
    const { attributes, customAttributes } = this.props;
    const { activeAttribute } = this.state;
    if (JSON.stringify(prevProps.attributes) !== JSON.stringify(attributes)) {
      const selectableAttributes = this.updateAttributes(attributes);
      this.updateState(selectableAttributes, head(selectableAttributes));
    }
    if (
      JSON.stringify(prevProps.customAttributes) !==
      JSON.stringify(customAttributes)
    ) {
      const selectableAttributes = this.updateAttributes(
        difference(attributes, customAttributes),
      );
      this.updateState(
        selectableAttributes,
        find(propEq('id', activeAttribute && activeAttribute.id))(
          selectableAttributes,
        )
          ? activeAttribute
          : head(selectableAttributes),
      );
    }
  }

  updateAttributes = (
    attributes: Array<GetAttributeType>,
  ): Array<SelectItemType> =>
    map(
      item => ({
        id: item.id,
        label: getNameText(item.name, 'EN'),
      }),
      attributes,
    );

  updateState = (
    selectableAttributes: Array<SelectItemType>,
    activeAttribute: ?SelectItemType,
  ) => {
    this.setState({
      selectableAttributes,
      activeAttribute,
    });
  };

  handleOnSelect = (activeAttribute: ?SelectItemType) => {
    this.setState({ activeAttribute });
  };

  handleCreateAttribute = () => {
    const { attributes } = this.props;
    const { activeAttribute } = this.state;
    if (activeAttribute) {
      const attribute = find(propEq('id', activeAttribute.id))(attributes);
      if (attribute) {
        this.props.onCreateAttribute(attribute);
      }
    }
  };

  handleRemoveAttribute = (id: string) => {
    this.props.onRemoveAttribute(id);
  };

  render() {
    const { customAttributes, onlyView } = this.props;
    const { selectableAttributes, activeAttribute } = this.state;
    return (
      <div
        styleName={classNames('container', {
          onlyViewContainer: onlyView,
        })}
      >
        {!onlyView && (
          <div>
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
                dataTest="customAttributtesSelect"
                fullWidth
              />
            </div>
            {activeAttribute && (
              <button
                styleName="button"
                onClick={this.handleCreateAttribute}
                data-test="customAttributtesAddButton"
              >
                <div styleName="buttonIcon">
                  <Icon inline type="plus" size={20} />
                </div>
                <div styleName="buttonText">Add</div>
              </button>
            )}
          </div>
        )}
        {onlyView && (
          <div styleName="onlyViewTitle">Additional characteristics</div>
        )}
        <div styleName="customAttributes">
          {map(
            item => (
              <div
                key={item.id}
                styleName={classNames('attribute', {
                  onlyViewAttribute: onlyView,
                })}
              >
                <div styleName="label">{getNameText(item.name, 'EN')}</div>
                {!onlyView && (
                  <button
                    styleName="cross"
                    onClick={() => {
                      this.handleRemoveAttribute(item.id);
                    }}
                    data-test="customAttributtesRemoveButton"
                  >
                    <Icon inline type="cross" size={12} />
                  </button>
                )}
              </div>
            ),
            customAttributes,
          )}
        </div>
      </div>
    );
  }
}

export default Index;
