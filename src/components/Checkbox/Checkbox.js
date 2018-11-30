// @flow strict

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import './Checkbox.scss';

type PropsType = {
  id: string,
  label: string | boolean,
  isChecked: boolean,
  onChange: string => void,
  radioStyle: boolean,
};

class Checkbox extends PureComponent<PropsType> {
  static defaultProps = {
    radioStyle: false,
  };

  onChange = () => {
    const { id, onChange } = this.props;
    onChange(id);
  };

  render() {
    const { id, label, isChecked, radioStyle } = this.props;
    return (
      <div styleName={classNames('container', { radioStyle })}>
        <input
          styleName="input"
          id={id}
          type="checkbox"
          checked={isChecked}
          onChange={this.onChange}
          data-test={id}
        />
        <label htmlFor={id} styleName="label">
          <span styleName="labelText">{label}</span>
        </label>
      </div>
    );
  }
}

export default Checkbox;
