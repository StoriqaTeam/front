// @flow

import React from 'react';
import { uniq, sort, pathOr, map, addIndex, filter, comparator, lt } from 'ramda';

import { getNameText } from 'utils';
import { Checkbox } from 'components/common/Checkbox';
import { ColorPicker } from 'components/ColorPicker';
import { Select } from 'components/common/Select';

import './AttributeControl.scss';

type TranslateType = {
  text: string,
  lang: string
}

type AttributeType = {
  id: string,
  name: Array<TranslateType>,
  metaField: {
    values: ?Array<string>,
    translatedValues: ?Array<{ translations: TranslateType }>,
    uiElement: string,
  },
}

type PropsType = {
  onChange: (value: string | Array<string>) => void,
  attrFilter: {
    attribute: AttributeType,
    equal: ?{
      values: Array<string>
    },
    range: ?{
      min: number,
      max: number
    }
  },
}

type StateType = {
  value: ?string | ?Array<string>,
}

class AttributeControll extends React.Component<PropsType, StateType> {
  state = {
    value: '',
  }

  handleOnChange = (val: string) => {
    const { onChange } = this.props;
    const { attrFilter } = this.props;
    const { value } = this.state;
    const uiElement = pathOr(null, ['attribute', 'metaField', 'uiElement'], attrFilter);
    const isMultiSelectable = uiElement === 'CHECKBOX' || uiElement === 'COLOR_PICKER';
    if (isMultiSelectable && value) {
      const valResult = !value.includes(val) ? [
        ...value,
        val,
      ] : [
        ...filter(v => v !== val, value),
      ];
      this.setState({
        ...this.state,
        value: valResult,
      });
      onChange(valResult);
    } else if (isMultiSelectable && !value) {
      this.setState({
        ...this.state,
        value: [val],
      });
      onChange([val]);
    } else {
      this.setState({
        ...this.state,
        value: val,
      });
      onChange([val]);
    }
  }

  renderControll = () => {
    const { attrFilter } = this.props;
    const { value } = this.state;
    const uiElement = pathOr(null, ['attribute', 'metaField', 'uiElement'], attrFilter);
    const values = pathOr(null, ['equal', 'values'], attrFilter);
    const mapIndexed = addIndex(map);
    switch (uiElement) {
      case 'CHECKBOX':
        return (values && mapIndexed((v, index) => (
          <div key={`${v}-${index}`} styleName="valueItem">
            <Checkbox
              id={v}
              label={v}
              isChecked={value && value.includes(v)}
              onChange={this.handleOnChange}
            />
          </div>
        ), sort((a, b) => (a - b), uniq(values))));
      case 'COMBOBOX':
        return (values ?
          <Select
            forForm
            activeItem={{ id: value, label: value }}
            items={map(v => ({ id: v, label: v }), sort(comparator((a, b) => lt(a, b)), uniq(values)))}
            onSelect={item => this.handleOnChange(item.id)}
            containerStyle={{
              width: '100%',
              height: '3rem',
              marginBottom: '1rem',
            }}
            dataTest="attributeControlSelect"
          /> : null);
      case 'COLOR_PICKER':
        return (values ?
          <ColorPicker
            onSelect={this.handleOnChange}
            items={uniq(values)}
            value={value}
          /> : null);
      default:
        return null;
    }
  }

  render() {
    const { attrFilter } = this.props;
    return (
      <div styleName="container">
        <div styleName="blockTitle">{getNameText(attrFilter.attribute.name, 'EN')}</div>
        {this.renderControll()}
      </div>
    );
  }
}

export default AttributeControll;
