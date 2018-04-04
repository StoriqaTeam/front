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
}

class Ranger extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      volume: 0,
    };
  }

  handleOnChange = (volume: number) => {
    console.log('^^^^ handler on change value: ', { volume })
    this.setState({
      volume,
    });
  }

  render() {
    const { volume } = this.state;
    return (
      <div styleName="wrapper">
        <div styleName="rangerContainer">
          <RangerSlider
            min={0}
            max={100}
            value={volume}
            orientation="horizontal"
            onChange={this.handleOnChange}
          />
          {/* <Slider
            min={0}
            max={100}
            value={volume}
            orientation="horizontal"
            onChange={this.handleOnChange}
          /> */}
          <div styleName="leftControll" />
          <div styleName="rightControll" />
        </div>
      </div>
    );
  }
}


export default Ranger;
