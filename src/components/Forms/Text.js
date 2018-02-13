// @flow

import React, { Component, Fragment } from 'react';

import './Text.scss';

type PropsType = {
  id: string,
  label: string,
  styles: string,
  errors: Array<string>,
  onChange?: Function,
};

type StateType = {
  value: string,
};

class Text extends Component<PropsType, StateType> {
  state: StateType = {
    value: '',
  };

  handleChange = (e: {target: { value: ?string }}) => {
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.value);
  };

  render() {
    const {
      id,
      label,
      styles = 'default',
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
          value={this.state.value}
          onChange={this.handleChange}
          styleName={styles}
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
