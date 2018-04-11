import React, { PureComponent } from 'react';

import './Checkbox.scss';

type PropsTypes = {
  id: string,
  label: boolean,
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
