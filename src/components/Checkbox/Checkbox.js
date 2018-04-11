// @flow

import React from 'react';

import './Checkbox.scss';

type PropsType = {
  id: string,
  label: boolean,
  labelStyle: ?{
    [key: string]: any,
  },
  isChecked: boolean,
  onChange: Function,
};

class Checkbox extends PureComponent<PropsTypes> {
  onChange = () => {
    const { id, onChange } = this.props;
    onChange(id);
  }

  render() {
    const { id, label, isChecked } = this.props;
    return (
      <div styleName="container">
        <input
          styleName="input"
          id={id}
          type="checkbox"
          checked={isChecked}
          onChange={this.onChange}
        />
        <label htmlFor={id} styleName="label">
          <span styleName="labelText">{label}</span>
        </label>
      </div>
    );
  }
}

export default Checkbox;
