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
  };

  render() {
    const { label, isChecked } = this.props;
    return (
      <div styleName="container">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={this.handleCheckboxChange}
        />
        <span styleName="label">{label}</span>
      </div>
    );
  }
}

export default Checkbox;
