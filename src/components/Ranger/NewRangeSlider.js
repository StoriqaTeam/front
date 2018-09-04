// @flow

import React, { Component, createRef } from 'react';

import './NewRangeSlider.scss';

type StateType = {
  thumb1: number,
  thumb2: number,
  minValue: number,
  maxValue: number,
};

type PropsType = {
  //
};

class NewRangeSlider extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.thumb1Ref = createRef();
    this.thumb2Ref = createRef();
    this.shadowLeftTrackRef = createRef();
    this.shadowRightTrackRef = createRef();
    this.sectionRef = createRef();

    this.state = {
      thumb1: parseFloat(500),
      thumb2: parseFloat(50000),
      minValue: parseFloat(500),
      maxValue: parseFloat(50000),
    };
  }

  thumb1Ref: any;
  thumb2Ref: any;
  shadowLeftTrackRef: any;
  shadowRightTrackRef: any;
  sectionRef: any;

  handleOnChange = (e: any) => {
    const { value, id } = e.target;
    this.setState({ [id]: parseFloat(value) }, () => {
      if (this.state.thumb1 > this.state.thumb2) {
        this.setState((prevState: StateType) => ({
          thumb1: prevState.thumb2,
          thumb2: prevState.thumb1,
        }));
      }
      const { thumb1, thumb2, minValue, maxValue } = this.state;
      const fullWidth = maxValue - minValue;
      this.shadowLeftTrackRef.current.style.width = `${100 *
        (thumb1 - minValue) /
        fullWidth}%`;
      this.shadowRightTrackRef.current.style.width = `${100 *
        (maxValue - thumb2) /
        fullWidth}%`;
    });
  };

  handleOnMouseDown = (e: any) => {
    const { id } = e.target;
    if (id === 'thumb1') {
      this.thumb1Ref.current.style.zIndex = 3;
    } else {
      this.thumb1Ref.current.style.zIndex = '';
    }
  };

  handleOnMouseDownSection = (e: any) => {
    // console.log('---e.clientX', e.clientX);
    const DOMRect = this.sectionRef.current.getBoundingClientRect();
    console.log('---DOMRect', DOMRect);

    // step (сколько в одной единице значения)
    const { thumb1, thumb2, minValue, maxValue } = this.state;
    const fullWidth = maxValue - minValue;
    const step = fullWidth / (DOMRect.width - 16);
    console.log('---step', step);

    // Coordinate
    let coor = e.clientX - DOMRect.x;
    if (coor <= 8) {
      coor = 0;
    } else if (coor >= DOMRect.width - 8) {
      coor = DOMRect.width - 16;
    }
    console.log('---coor', coor);
  };

  render() {
    const { thumb1, thumb2, minValue, maxValue } = this.state;
    return (
      <div styleName="container">
        <span className="rangeValues">{`${thumb1} - ${thumb2}`}</span>
        <section
          ref={this.sectionRef}
          styleName="range-slider"
          onMouseDown={this.handleOnMouseDownSection}
        >
          <input
            ref={this.thumb1Ref}
            id="thumb1"
            value={thumb1}
            min={minValue}
            max={maxValue}
            step="500"
            type="range"
            onChange={this.handleOnChange}
            onMouseDown={this.handleOnMouseDown}
          />
          <input
            ref={this.thumb2Ref}
            id="thumb2"
            value={thumb2}
            min={minValue}
            max={maxValue}
            step="500"
            type="range"
            onChange={this.handleOnChange}
            onMouseDown={this.handleOnMouseDown}
          />
          <div styleName="track">
            <div
              ref={this.shadowLeftTrackRef}
              styleName="shadowTrack shadowLeftTrack"
            />
            <div
              ref={this.shadowRightTrackRef}
              styleName="shadowTrack shadowRightTrack"
            />
          </div>
        </section>
      </div>
    );
  }
}

export default NewRangeSlider;
