// @flow strict

import React, { PureComponent } from 'react';

import type { Element } from 'react';

import './Checkbox.scss';

type PropsType = {
  id: string | number,
  label: string | Element<'span'>,
  isChecked: ?boolean,
  onChange: <T: string>(T) => T | void,
};

class Checkbox extends PureComponent<PropsType> {
  static defaultProps = {
    id: 'stq',
    label: '',
    isChecked: false,
    onChange: () => {},
  };
  onChange = (): void => {
    const { id, onChange } = this.props;
    onChange(`${id}`);
  };
  stopPropagation = (e: SyntheticEvent<HTMLDivElement>): void => {
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
