// @flow

import React, { Component, createRef } from 'react';

import { InputPrice } from 'components/common/InputPrice';

import './RangeSlider.scss';

type StateType = {
  thumb1: number,
  thumb2: number,
  minValue: number,
  maxValue: number,
  thumb1InputValue: number,
  thumb2InputValue: number,
  focusedInput: ?string,
  thumb1Phantom: number,
  thumb2Phantom: number,
  stepPhantom: number,
};

type PropsType = {
  thumb1: number,
  thumb2: number,
  minValue: number,
  maxValue: number,
  onChange: ({
    thumb1: number,
    thumb2: number,
  }) => void,
};

class RangeSlider extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const { thumb1, thumb2, minValue, maxValue } = nextProps;
    if (minValue !== prevState.minValue || maxValue !== prevState.maxValue) {
      const stepPhantom = (maxValue - minValue) / 100;
      return {
        ...prevState,
        thumb1,
        thumb2,
        minValue,
        maxValue,
        thumb1InputValue: thumb1,
        thumb2InputValue: thumb2,
        thumb1Phantom: 0,
        thumb2Phantom: 100,
        stepPhantom,
      };
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    const { thumb1, thumb2, minValue, maxValue } = props;

    this.state = {
      thumb1,
      thumb2,
      minValue,
      maxValue,
      thumb1InputValue: thumb1,
      thumb2InputValue: thumb2,
      focusedInput: null,
      thumb1Phantom: 0,
      thumb2Phantom: 100,
      stepPhantom: (maxValue - minValue) / 100,
    };

    this.thumb1Ref = createRef();
    this.thumb2Ref = createRef();
    this.sectionRef = createRef();

    if (process.env.BROWSER) {
      window.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('keydown', this.handleKeydown);
    }
  }

  onChangeEvent = (
    id: 'thumb1' | 'thumb2',
    value: number,
    prevValue: number,
  ) => {
    const event = new Event('input', { bubbles: true });
    // $FlowIgnore
    event.simulated = true;
    // $FlowIgnore
    this[`${id}Ref`].current.value = value;
    // $FlowIgnore
    const tracker = this[`${id}Ref`].current._valueTracker; // eslint-disable-line
    if (tracker) {
      tracker.setValue(prevValue);
    }
    // $FlowIgnore
    this[`${id}Ref`].current.dispatchEvent(event);
  };

  setValues = (id: 'thumb1' | 'thumb2', value: number) => {
    const { stepPhantom } = this.state;
    // $FlowIgnore
    this[`${id}Ref`].current.value = Math.round(value / stepPhantom);
    this.setState(
      {
        [`${id}`]: value,
        [`${id}Phantom`]: Math.round(value / stepPhantom),
        [`${id}InputValue`]: value,
      },
      this.transferData,
    );
  };

  formatNumber = (value: number) => Number(value.toFixed(8));

  transferData = () => {
    this.props.onChange({
      thumb1: this.formatNumber(this.state.thumb1),
      thumb2: this.formatNumber(this.state.thumb2),
    });
  };

  handleKeydown = (e: any) => {
    const { focusedInput } = this.state;
    if (e.keyCode === 13 && focusedInput) {
      // $FlowIgnore
      this[`${focusedInput}Ref`].blur();
    }
  };

  thumb1Ref: any;
  thumb2Ref: any;
  sectionRef: any;
  thumb1InputRef: any;
  thumb2InputRef: any;

  handleOnChange = (e: any) => {
    const { value, id } = e.target;
    const { stepPhantom, minValue } = this.state;
    this.setState(
      {
        [id]: parseFloat(value) ? parseFloat(value) * stepPhantom : minValue,
        [`${id}Phantom`]: parseFloat(value),
        [`${id}InputValue`]: parseFloat(value)
          ? parseFloat(value) * stepPhantom
          : minValue,
      },
      () => {
        this.transferData();
        if (this.state.thumb1Phantom > this.state.thumb2Phantom) {
          this.setState(
            (prevState: StateType) => ({
              thumb1: prevState.thumb2
                ? prevState.thumb2 * stepPhantom
                : prevState.minValue,
              thumb2: prevState.thumb1 * stepPhantom,
              thumb1Phantom: prevState.thumb2Phantom,
              thumb2Phantom: prevState.thumb1Phantom,
              thumb1InputValue: prevState.thumb2Phantom
                ? prevState.thumb2Phantom * stepPhantom
                : prevState.minValue,
              thumb2InputValue: prevState.thumb1Phantom * stepPhantom,
            }),
            this.transferData,
          );
        }
      },
    );
  };

  handleOnMouseDown = (e: any) => {
    const { id } = e.target;
    if (id === 'thumb1Phantom') {
      this.thumb1Ref.current.style.zIndex = 3;
    } else {
      this.thumb1Ref.current.style.zIndex = '';
    }
  };

  handleOnMouseDownSection = (e: any) => {
    const DOMRect = this.sectionRef.current.getBoundingClientRect();

    // volume (how many in one unit of value)
    const { thumb1Phantom, thumb2Phantom } = this.state;
    const volume = 100 / (DOMRect.width - 16);

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
    const thumb = coor * volume;
    if (
      Math.abs(thumb2Phantom - thumb) < Math.abs(thumb - thumb1Phantom) ||
      (thumb2Phantom === thumb1Phantom && thumb2Phantom < thumb)
    ) {
      this.onChangeEvent('thumb2', thumb, thumb2Phantom);
      return;
    }
    this.onChangeEvent('thumb1', thumb, thumb1Phantom);
  };

  handleOnChangeInput = (id: string, value: number) => {
    if (id === 'thumb1Input') {
      this.setState({ thumb1InputValue: value });
    } else {
      this.setState({ thumb2InputValue: value });
    }
  };

  handleOnFocusInput = (id: string) => {
    this.setState({ focusedInput: id });
  };

  handleOnBlurInput = (id: string) => {
    const {
      thumb1InputValue,
      thumb2InputValue,
      minValue,
      maxValue,
    } = this.state;
    if (id === 'thumb1Input') {
      if (thumb1InputValue < minValue) {
        this.setValues('thumb1', minValue);
      } else if (thumb1InputValue > thumb2InputValue) {
        this.setValues('thumb1', thumb2InputValue);
      } else {
        this.setValues('thumb1', thumb1InputValue);
      }
    }
    if (thumb2InputValue > maxValue) {
      this.setValues('thumb2', maxValue);
    } else if (thumb2InputValue < thumb1InputValue) {
      this.setValues('thumb2', thumb1InputValue);
    } else {
      this.setValues('thumb2', thumb2InputValue);
    }
    this.setState({ focusedInput: null });
  };

  render() {
    const {
      minValue,
      maxValue,
      thumb1InputValue,
      thumb2InputValue,
      thumb1Phantom,
      thumb2Phantom,
    } = this.state;
    return (
      <div styleName="container">
        <div
          ref={this.sectionRef}
          styleName="range-slider"
          onMouseDown={this.handleOnMouseDownSection}
          role="button"
          tabIndex="0"
        >
          <input
            ref={this.thumb1Ref}
            id="thumb1"
            value={thumb1Phantom}
            min={0}
            max={100}
            step={1}
            type="range"
            onChange={this.handleOnChange}
            onMouseDown={this.handleOnMouseDown}
          />
          <input
            ref={this.thumb2Ref}
            id="thumb2"
            value={thumb2Phantom}
            min={0}
            max={100}
            step={1}
            type="range"
            onChange={this.handleOnChange}
            onMouseDown={this.handleOnMouseDown}
          />
          <div styleName="trackWrap">
            <div styleName="track" />
            <div
              styleName="shadowTrack shadowLeftTrack"
              style={{ width: `${thumb1Phantom}%` }}
            />
            <div
              styleName="shadowTrack shadowRightTrack"
              style={{ width: `${100 - thumb2Phantom}%` }}
            />
          </div>
          <div styleName="minTooltip" title={minValue} />
          <div styleName="maxTooltip" title={maxValue} />
        </div>
        <div styleName="inputs">
          <div>
            <InputPrice
              inputRef={node => {
                this.thumb1InputRef = node;
              }}
              id="thumb1Input"
              onChangePrice={(value: number) => {
                this.handleOnChangeInput('thumb1Input', value);
              }}
              onBlur={() => this.handleOnBlurInput('thumb1Input')}
              onFocus={() => this.handleOnFocusInput('thumb1Input')}
              price={this.formatNumber(thumb1InputValue)}
              align="center"
            />
          </div>
          <div>
            <InputPrice
              inputRef={node => {
                this.thumb2InputRef = node;
              }}
              id="thumb2Input"
              onChangePrice={(value: number) => {
                this.handleOnChangeInput('thumb2Input', value);
              }}
              onFocus={() => this.handleOnFocusInput('thumb2Input')}
              onBlur={() => this.handleOnBlurInput('thumb2Input')}
              price={this.formatNumber(thumb2InputValue)}
              align="center"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RangeSlider;
