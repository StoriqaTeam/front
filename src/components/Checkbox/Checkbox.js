import React, { PureComponent } from 'react';

import './Checkbox.scss';

type PropsTypes = {
  id: string,
  label: boolean,
  isChecked: boolean,
  handleCheckboxChange: Function,
};

class Checkbox extends PureComponent<PropsTypes> {
  handleCheckboxChange = () => {
    const { id, handleCheckboxChange } = this.props;
    handleCheckboxChange(id);
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
          onChange={this.handleCheckboxChange}
        />
        <label htmlFor={id} styleName="label">
          <span styleName="labelText">{label}</span>
        </label>
      </div>
    );
  }
}

export default Checkbox;
