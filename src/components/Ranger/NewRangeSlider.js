// @flow

import React, { Component, createRef } from 'react';

import { Input } from 'components/common/Input';
import { InputPrice } from 'components/common/InputPrice';

import './NewRangeSlider.scss';

type StateType = {
  thumb1: number,
  thumb2: number,
  minValue: number,
  maxValue: number,
  step: number,
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
      step: parseFloat(500),
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
    const DOMRect = this.sectionRef.current.getBoundingClientRect();

    // volume (how many in one unit of value)
    const { thumb1, thumb2, minValue, maxValue, step } = this.state;
    const fullWidth = maxValue - minValue;
    const volume = fullWidth / (DOMRect.width - 16);

    // Coordinate
    let coor = e.clientX - DOMRect.x;
    if (coor <= 8) {
      coor = 0;
    } else if (coor >= DOMRect.width - 8) {
      coor = DOMRect.width - 16;
    } else {
      coor -= 8;
    }

    // New thumb
    let thumb = Math.round(coor * volume) + minValue;
    const remainder = thumb % step;
    if (remainder <= step) {
      thumb -= remainder;
    } else {
      thumb += remainder;
    }
    let key = thumb2 === thumb1 && thumb2 < thumb ? 'thumb2' : 'thumb1';
    if (Math.abs(thumb2 - thumb) < Math.abs(thumb - thumb1)) {
      key = 'thumb2';
    } else if (Math.abs(thumb2 - thumb) > Math.abs(thumb - thumb1)) {
      key = 'thumb1';
    }
    const event = new Event('input', { bubbles: true });
    // $FlowIgnore
    event.simulated = true;
    if (key === 'thumb1') {
      this.thumb1Ref.current.value = `${thumb}`;
      const tracker = this.thumb1Ref.current._valueTracker; // eslint-disable-line
      if (tracker) {
        tracker.setValue(thumb1);
      }
      this.thumb1Ref.current.dispatchEvent(event);
    } else {
      this.thumb2Ref.current.value = `${thumb}`;
      const tracker = this.thumb2Ref.current._valueTracker; // eslint-disable-line
      if (tracker) {
        tracker.setValue(thumb2);
      }
      this.thumb2Ref.current.dispatchEvent(event);
    }
  };

  handleOnChangeInput = value => {
    console.log('---value', value);
  };

  handleOnBlurInput = () => {};

  render() {
    const { thumb1, thumb2, minValue, maxValue, step } = this.state;
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
            step={step}
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
            step={step}
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
        <div styleName="inputs">
          <div styleName="input left">
            <InputPrice
              id="rangeInput1"
              onChangePrice={this.handleOnChangeInput}
              onBlur={this.handleOnBlurInput}
              price={thumb1}
            />
          </div>
          <div styleName="input right">
            <InputPrice
              id="rangeInput2"
              onChangePrice={this.handleOnChangeInput}
              onBlur={this.handleOnBlurInput}
              price={thumb2}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default NewRangeSlider;
