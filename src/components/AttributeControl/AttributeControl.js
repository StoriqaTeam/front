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
  isEmpty,
} from 'ramda';

import { getNameText } from 'utils';
import { Checkbox } from 'components/common/Checkbox';
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
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
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

  handleOnChange = (receivedVal: string) => {
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
    const splitedVal = receivedVal.split('-');
    const val = splitedVal.length > 1 ? splitedVal[1] : splitedVal[0];
    if (isMultiSelectable && value) {
      const valResult = !value.includes(val)
        ? [...value, val]
        : [...filter(v => v !== val, value)];
      onChange(valResult);
    } else if (isMultiSelectable && !value) {
      onChange([val]);
    } else {
      onChange([receivedVal]);
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
                <Checkbox
                  id={`CHECKBOX-${v}`}
                  label={v}
                  isChecked={value && value.includes(v)}
                  onChange={this.handleOnChange}
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
            activeItem={
              // $FlowIgnoreMe
              !isEmpty(value) ? { id: value[0], label: value[0] } : null
            }
            items={preparedValues}
            onSelect={item => {
              if (item) {
                this.handleOnChange(item.id);
              } else {
                this.setState({ value: [] });
              }
            }}
            containerStyle={{
              width: '100%',
              height: '3rem',
              marginBottom: '1rem',
              marginTop: '0.5rem',
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
