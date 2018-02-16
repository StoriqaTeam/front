// @flow

import React, { PureComponent, Fragment } from 'react';

type PropsType = {
  id: string,
  label: string,
  checked: boolean,
  onChange: Function,
  errors: Array<string>,
};

class Checkbox extends PureComponent<PropsType> {
  handleChange = () => {
    this.props.onChange(!this.props.checked);
  };

  render() {
    const {
      id,
      label,
      checked,
      errors,
    } = this.props;
    return (
      <Fragment>
        <label htmlFor={id}>
          {label}
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={this.handleChange}
          />
        </label>
        {errors && errors.length > 0 && (
          <span>{errors}</span>
        )}
      </Fragment>
    );
  }
}

export default Checkbox;
