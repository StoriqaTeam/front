// @flow

import React from 'react';
import { RangerSlider } from './lib';
import Slider from 'react-rangeslider';
// import 'react-rangeslider/lib/index.css';

// import AccordionBlock from './AccordionBlock';

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
      volume: 0,
      volume2: 0,
    };
  }

  handleOnChange = (value: number, fieldName: string) => {
    this.setState({
      [fieldName]: value,
    });
  }

  render() {
    const { volume, volume2 } = this.state;
    console.log('***** value: ', { volume, volume2 });
    return (
      <div styleName="wrapper">
        <div styleName="rangerContainer">
          <RangerSlider
            min={0}
            max={1000}
            value={volume}
            value2={volume2}
            orientation="horizontal"
            onChange={value => this.handleOnChange(value, 'volume')}
            onChange2={value => this.handleOnChange(value, 'volume2')}
          />
          {/* <Slider
            min={0}
            max={100}
            value={volume}
            orientation="horizontal"
            onChange={this.handleOnChange}
          /> */}
          <div styleName="leftControll">{volume}</div>
          <div styleName="rightControll">{volume2}</div>
        </div>
      </div>
    );
  }
}


export default Ranger;
