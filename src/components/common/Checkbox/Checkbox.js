// @flow

import React, { PureComponent } from 'react';

import './Checkbox.scss';

type PropsType = {
  id: string,
  label?: string,
  isChecked: boolean,
  onChange: Function,
};

class Checkbox extends PureComponent<PropsType> {
  onChange = () => {
    const { id, onChange } = this.props;
    onChange(id);
  };

  stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  render() {
    const { id, label, isChecked } = this.props;
    return (
      <div
        styleName="container"
        onClick={this.stopPropagation}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        <input
          styleName="input"
          id={id}
          type="checkbox"
          checked={isChecked}
          onChange={this.onChange}
          data-test={id}
          onClick={this.stopPropagation}
        />
        <label htmlFor={id} styleName="label">
          <span styleName="labelText">{label}</span>
        </label>
      </div>
    );
  }
}

export default Checkbox;
