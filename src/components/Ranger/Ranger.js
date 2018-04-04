// @flow

import React from 'react';
import { RangerSlider } from './lib';

import './Ranger.scss';


type PropsType = {
  // onStartChange?: (value: number) => void,
  // onEndChange?: (value: number) => void,
}

type StateType = {
  volume: number,
  volume2: number,
}

class Ranger extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      volume: 2,
      volume2: 4.005,
    };
  }

  handleOnChange = (value: number, fieldName: string) => {
    this.setState({
      [fieldName]: value,
    });
  }

  render() {
    const { volume, volume2 } = this.state;
    return (
      <div styleName="wrapper">
        <div styleName="rangerContainer">
          <RangerSlider
            min={0}
            max={10}
            step={0.0001}
            value={volume}
            value2={volume2}
            orientation="horizontal"
            onChange={value => this.handleOnChange(value, 'volume')}
            onChange2={value => this.handleOnChange(value, 'volume2')}
          />
          <div styleName="valuesContainer">
            <div styleName="leftValue value">{volume}</div>
            <div styleName="rightValue value">{volume2}</div>
          </div>
        </div>
      </div>
    );
  }
}


export default Ranger;
