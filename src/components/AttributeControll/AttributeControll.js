// @flow

import React from 'react';
import { pathOr, map } from 'ramda';

import { getNameText } from 'utils';
import { Checkbox } from 'components/Checkbox';
import { ColorPicker } from 'components/ColorPicker';
import { MiniSelect } from 'components/MiniSelect';

import './AttributeControll.scss';

type TranslateType = {
  text: string,
  lang: string
}

type AttributeType = {
  id: string,
  name: Array<TranslateType>,
  metaField: ?{
    values: ?Array<string>,
    translatedValues: ?Array<TranslateType>,
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
    value: null,
  }

  handleOnChange = (value: string) => {
    const { onChange } = this.props;
    const { attrFilter } = this.props;
    const uiElement = pathOr(null, ['attribute', 'metaField', 'uiElement'], attrFilter);
    const isMultiSelectable = uiElement === 'CHECKBOX' || uiElement === 'COLOR_PICKER';
    if (isMultiSelectable) {
      const valResult = this.state.value ? [
        ...this.state.value,
        value,
      ] : [value];
      this.setState({
        ...this.state,
        value: valResult,
      });
      onChange(valResult);
    } else {
      this.setState({
        ...this.state,
        value,
      });
      onChange(value);
    }
  }

  renderControll = () => {
    const { attrFilter } = this.props;
    const { value } = this.state;
    const uiElement = pathOr(null, ['attribute', 'metaField', 'uiElement'], attrFilter);
    const values = pathOr(null, ['equal', 'values'], attrFilter);
    switch (uiElement) {
      case 'CHECKBOX':
        return (values && values.map(v => (
          <div key={v} styleName="valueItem">
            <Checkbox
              id={v}
              label={v}
              isChecked={value && value.includes(v)}
              handleCheckboxChange={this.handleOnChange}
            />
          </div>
        )));
      case 'COMBOBOX':
        return (values ?
          <MiniSelect
            forForm
            items={map(v => ({ id: v, label: v }), values)}
            onSelect={item => this.handleOnChange(item.id)}
            activeItem={{ id: value, label: value }}
            containerStyle={{
              width: '100%',
            }}
          /> : null);
      case 'COLOR_PICKER':
        return (values ?
          <ColorPicker
            onSelect={this.handleOnChange}
            items={values}
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
