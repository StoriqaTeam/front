// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import './CheckboxButton.scss';

type PropsType = {
  id: string,
  label?: string,
  isChecked: boolean,
  onChange: Function,
};

class RadioCheckbox extends PureComponent<PropsType> {
  onChange = () => {
    const { id, onChange } = this.props;
    onChange(id);
  };

  render() {
    const { id, label, isChecked } = this.props;
    return (
      <div
        styleName={classNames('container', { isChecked })}
        onClick={this.onChange}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
        id={id}
        data-test={id}
      >
        <div styleName="box">
          <div styleName="radio" />
        </div>
        <div styleName="labelText">{label}</div>
      </div>
    );
  }
}

export default RadioCheckbox;
