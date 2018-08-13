// @flow

import React from 'react';
import {
  prepend,
  uniq,
  sort,
  pathOr,
  map,
  addIndex,
  filter,
  comparator,
  lt,
} from 'ramda';

import { getNameText } from 'utils';
import { CheckboxButton } from 'components/common/CheckboxButton';
import { ColorPicker } from 'components/ColorPicker';
import { Select } from 'components/common/Select';

import './AttributeControl.scss';

type TranslateType = {
  text: string,
  lang: string,
};

type AttributeType = {
  id: string,
  name: Array<TranslateType>,
  metaField: {
    values: ?Array<string>,
    translatedValues: ?Array<{ translations: TranslateType }>,
    uiElement: string,
  },
};

type AttributeFilterType = {
  attribute: AttributeType,
  equal: ?{
    values: Array<string>,
  },
  range: ?{
    min: number,
    max: number,
  },
};

type PropsType = {
  onChange: (value: string | Array<string>) => void,
  attrFilter: AttributeFilterType,
  initialValues: Array<string>,
};

type StateType = {
  value: ?Array<string>,
};

class AttributeControll extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      value: nextProps.initialValues,
    };
  }

  constructor(props: PropsType) {
    super(props);
    this.state = {
      value: props ? props.initialValues : [],
    };
  }

  handleOnChange = (val: string) => {
    const { onChange, attrFilter } = this.props;
    const { value } = this.state;
    const uiElement = pathOr(
      null,
      ['attribute', 'metaField', 'uiElement'],
      // $FlowIgnoreMe
      attrFilter,
    );

    const isMultiSelectable =
      uiElement === 'CHECKBOX' || uiElement === 'COLOR_PICKER';
    if (isMultiSelectable && value) {
      const valResult = !value.includes(val)
        ? [...value, val]
        : [...filter(v => v !== val, value)];
      onChange(valResult);
    } else if (isMultiSelectable && !value) {
      onChange([val]);
    } else {
      onChange([val]);
    }
  };

  renderControll = () => {
    const { attrFilter } = this.props;
    const { value } = this.state;
    const uiElement = pathOr(
      null,
      ['attribute', 'metaField', 'uiElement'],
      // $FlowIgnoreMe
      attrFilter,
    );
    // $FlowIgnoreMe
    const values = pathOr(null, ['equal', 'values'], attrFilter);
    const mapIndexed = addIndex(map);
    switch (uiElement) {
      case 'CHECKBOX':
        return (
          values &&
          mapIndexed(
            (v, index) => (
              <div key={`${v}-${index}`} styleName="valueItem">
                <CheckboxButton
                  id={v}
                  label={v}
                  isChecked={value && value.includes(v)}
                  onChange={this.handleOnChange}
                  // onChange={console.log}
                />
              </div>
            ),
            sort((a, b) => a - b, uniq(values)),
          )
        );
      case 'COMBOBOX': {
        const objValues = map(
          v => ({ id: v, label: v }),
          sort(comparator((a, b) => lt(a, b)), uniq(values)),
        );
        // adding not selected item with empty id for reset combobox
        const preparedValues = prepend(
          { id: '', label: 'not selected' },
          objValues,
        );
        return values ? (
          <Select
            forForm
            activeItem={value ? { id: value[0], label: value[0] } : null}
            items={preparedValues}
            onSelect={item => this.handleOnChange(item.id)}
            containerStyle={{
              width: '100%',
              height: '3rem',
              marginBottom: '1rem',
            }}
            dataTest="attributeControlSelect"
          />
        ) : null;
      }
      case 'COLOR_PICKER':
        return values ? (
          <ColorPicker
            onSelect={this.handleOnChange}
            items={uniq(values)}
            value={value}
          />
        ) : null;
      default:
        return null;
    }
  };

  render() {
    const { attrFilter } = this.props;
    return (
      <div styleName="container">
        <div styleName="blockTitle">
          {getNameText(attrFilter.attribute.name, 'EN')}
        </div>
        {this.renderControll()}
      </div>
    );
  }
}

export default AttributeControll;
