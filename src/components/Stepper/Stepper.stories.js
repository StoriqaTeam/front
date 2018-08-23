// @flow

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Stepper from 'components/Stepper';

type PropsType = {
  min?: ?number,
  max?: ?number,
};

type StateType = {
  value: number,
}

class StepperHolder extends Component<PropsType, StateType> {
  state = {
    value: 0,
  };

  handleChange(value: number) {
    this.setState({ value });
    action('change')(value);
  }

  render() {
    return (
      <Stepper
        min={this.props.min}
        max={this.props.max}
        value={this.state.value}
        onChange={val => this.handleChange(val)}
      />
    );
  }
}

storiesOf('Stepper', module)
  .add('All', () => (
    <div>
      <StepperHolder min={0} />
    </div>
  ));
