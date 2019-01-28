// @flow strict

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import type { Element } from 'react';

import './Checkbox.scss';

type PropsType = {
  id: string | number,
  label: string | Element<'span'>,
  isChecked: ?boolean,
  onChange: <T: string>(T) => T | void,
  dataTest?: string,
  isRadio?: boolean,
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
    const { id, label, isChecked, dataTest, isRadio } = this.props;
    const dataTestValue = dataTest != null ? dataTest : id;
    return (
      <div
        styleName="container"
        onClick={this.stopPropagation}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        <input
          styleName={classNames('input', { isRadio })}
          id={id}
          type="checkbox"
          checked={isChecked}
          onChange={this.onChange}
          onClick={this.stopPropagation}
        />
        <label htmlFor={id} styleName="label" data-test={dataTestValue}>
          <span styleName="labelBefore" />
          <span styleName="labelText">{label}</span>
          <span styleName="labelAfter" />
        </label>
      </div>
    );
  }
}

export default Checkbox;
