// @flow

import React, { PureComponent, Fragment } from 'react';

import './Text.scss';

type PropsType = {
  id: string,
  value: string,
  label: string,
  errors: ?Array<string>,
  onChange: Function,
};

class Text extends PureComponent<PropsType> {
  handleChange = (e: {target: { value: ?string }}) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const {
      id,
      value,
      label,
      errors,
    } = this.props;

    return (
      <label htmlFor={id}>
        {label}
        <br />
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={this.handleChange}
          styleName="default"
        />
        {errors && errors.length > 0 && (
          <Fragment>
            <br />
            <span styleName="errors">{errors}</span>
          </Fragment>
        )}
      </label>
    );
  }
}

export default Text;
