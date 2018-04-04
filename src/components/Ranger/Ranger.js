// @flow

import React from 'react';
import { RangerSlider } from './lib';
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
            value={volume}
            orientation="vertical"
            onChange={this.handleOnChange}
          />
          <div styleName="leftControll" />
          <div styleName="rightControll" />
        </div>
      </div>
    );
  }
}


export default Ranger;
