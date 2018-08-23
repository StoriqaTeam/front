import React from 'react';
import { storiesOf } from '@storybook/react';

import RangerSlider from './RangerSlider';

class RangerWrapper extends React.Component {
  state = {
    value: 0,
    value2: 100,
    maxValue: 100,
    result: null,
  }

  handleOnRangeChange = (value, name) => {
    this.setState({ [name]: value });
  }

  handleOnCompleteRange = (value, value2) => {
    this.setState({ result: { value, value2 } });
  }

  render() {
    const { value, value2, result, maxValue } = this.state;
    return (
      <div style={{ width: 200 }}>
        <RangerSlider
          min={0}
          max={maxValue}
          step={0.1}
          value={value > maxValue ? 0 : value}
          value2={value2 > maxValue ? maxValue : value2}
          onChange={value => this.handleOnRangeChange(value, 'value')}
          onChange2={value => this.handleOnRangeChange(value, 'value2')}
          onChangeComplete={this.handleOnCompleteRange}
        />
      </div>
    )
  }
}


storiesOf('Ranger', module)
  .add('from 0 to 100 values', () => (
    <RangerWrapper />
  ));
