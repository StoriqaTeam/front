// @flow strict

import React, { Component, createRef } from 'react';
import { isNil } from 'ramda';
// $FlowIgnore
import { InputPrice } from 'components/common/InputPrice';

import { calcStep, setRefValue, setZindex } from './utils';

import './RangeSlider.scss';

type InputRefType = { current: null | HTMLInputElement };
type DivRefType = { current: null | HTMLDivElement };
type ThumbNameType = 'thumb1' | 'thumb2';
type ThumbInputNameType = 'thumb1Input' | 'thumb2Input';
type InputRangeType = {
  ref: InputRefType,
  id: string,
  value: string,
  min: number,
  max: number,
  step: number,
  type: string,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
  onMouseDown: (SyntheticInputEvent<HTMLInputElement>) => void,
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

type StateType = {
  thumb1: number,
  thumb2: number,
  minValue: number,
  maxValue: number,
  thumb1InputValue: number,
  thumb2InputValue: number,
  focusedInput: ?ThumbInputNameType,
  thumb1Phantom: number,
  thumb2Phantom: number,
  stepPhantom: number,
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

    const stepPhantom = (maxValue - minValue) / 100;

    this.state = {
      thumb1,
      thumb2,
      minValue,
      maxValue,
      thumb1InputValue: thumb1,
      thumb2InputValue: thumb2,
      focusedInput: null,
      thumb1Phantom: Math.round(thumb1 / stepPhantom),
      thumb2Phantom: Math.round(thumb2 / stepPhantom),
      stepPhantom,
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

  onChangeEvent = (id: ThumbNameType, value: number, prevValue: number) => {
    const thumbRef = this.getThumbRef(id);
    const event = new Event('input', { bubbles: true });
    // $FlowIgnore
    event.simulated = true;
    setRefValue(thumbRef.current)(`${value}`);
    // $FlowIgnore
    const tracker = thumbRef.current._valueTracker; // eslint-disable-line
    if (tracker) {
      tracker.setValue(prevValue);
    }
    if (!isNil(thumbRef.current)) {
      thumbRef.current.dispatchEvent(event);
    }
  };

  getThumbRef = (id: ThumbNameType): InputRefType =>
    id === 'thumb1' ? this.thumb1Ref : this.thumb2Ref;

  getInputPriceRef = (id: ThumbInputNameType): ?HTMLInputElement =>
    id === 'thumb1Input' ? this.thumb1InputRef : this.thumb2InputRef;

  setValues = (id: ThumbNameType, value: number): void => {
    const { stepPhantom } = this.state;
    const thumbRef = this.getThumbRef(id);
    const roundedValue = Math.round(value / stepPhantom);
    setRefValue(thumbRef.current)(`${roundedValue}`);

    this.setState(
      {
        [`${id}`]: value,
        [`${id}Phantom`]: roundedValue,
        [`${id}InputValue`]: value,
      },
      this.transferData,
    );
  };

  formatNumber = (value: number): number => Number(value.toFixed());

  transferData = (): void => {
    const { onChange } = this.props;
    const { thumb1, thumb2 } = this.state;
    onChange({
      thumb1: this.formatNumber(thumb1),
      thumb2: this.formatNumber(thumb2),
    });
  };

  handleKeydown = (e: SyntheticKeyboardEvent<HTMLInputElement>): void => {
    const { focusedInput } = this.state;
    if (e.keyCode === 13 && !isNil(focusedInput)) {
      const inputRef = this.getInputPriceRef(focusedInput);
      if (!isNil(inputRef)) {
        inputRef.blur();
      }
    }
  };

  thumb1Ref: InputRefType;
  thumb2Ref: InputRefType;
  sectionRef: DivRefType;
  thumb1InputRef: ?HTMLInputElement;
  thumb2InputRef: ?HTMLInputElement;

  handleOnChange = (e: SyntheticInputEvent<HTMLInputElement>): void => {
    const { value, id } = e.target;
    const { stepPhantom, minValue } = this.state;
    const step: number => number = calcStep(stepPhantom);
    const parsedValue = parseFloat(value);
    const inputValue = parsedValue ? step(parsedValue) : minValue;
    this.setState(
      {
        [id]: inputValue,
        [`${id}Phantom`]: parsedValue,
        [`${id}InputValue`]: inputValue,
      },
      (): void => {
        this.transferData();
        if (this.state.thumb1Phantom > this.state.thumb2Phantom) {
          this.setState(
            (prevState: StateType) => ({
              thumb1: step(prevState.thumb2),
              thumb2: step(prevState.thumb1),
              thumb1Phantom: prevState.thumb2Phantom,
              thumb2Phantom: prevState.thumb1Phantom,
              thumb1InputValue: step(prevState.thumb2Phantom),
              thumb2InputValue: step(prevState.thumb1Phantom),
            }),
            this.transferData,
          );
        }
      },
    );
  };

  handleOnMouseDown = (e: SyntheticInputEvent<HTMLInputElement>): void => {
    const { id } = e.target;
    const { current } = this.thumb1Ref;
    const applyZindex: string => ?HTMLInputElement = setZindex(current);
    if (id === 'thumb1Phantom') {
      applyZindex('3');
    } else {
      applyZindex('');
    }
  };

  handleOnMouseDownSection = (e: SyntheticMouseEvent<HTMLDivElement>): void => {
    let DOMRect = {};

    if (!isNil(this.sectionRef.current)) {
      DOMRect = this.sectionRef.current.getBoundingClientRect();
    }

    // volume (how many in one unit of value)
    const { thumb1Phantom, thumb2Phantom } = this.state;
    const volume = 100 / (DOMRect.width - 16);

    // Coordinate
    /**
     * @desc 'x' is an experimental feature. use 'left' instead
     * @link https://github.com/facebook/flow/issues/5357
     */
    let coor = e.clientX - DOMRect.left;
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

  handleOnChangeInput = (id: ThumbInputNameType, value: number): void => {
    if (id === 'thumb1Input') {
      this.setState({ thumb1InputValue: value });
    } else {
      this.setState({ thumb2InputValue: value });
    }
  };

  handleOnFocusInput = (id: ThumbInputNameType): void => {
    this.setState({ focusedInput: id });
  };

  handleOnBlurInput = (id: ThumbInputNameType): void => {
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

  makeInputRanges = (ids: Array<ThumbNameType>): Array<InputRangeType> =>
    ids.map((id: ThumbNameType) => ({
      id,
      max: 100,
      min: 0,
      onChange: this.handleOnChange,
      onMouseDown: this.handleOnMouseDown,
      ref: this.getThumbRef(id),
      step: 1,
      type: 'range',
      value: this.state[`${id}Phantom`],
    }));

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
          {this.makeInputRanges(['thumb1', 'thumb2']).map(input => (
            <input key={input.id} {...input} />
          ))}
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
              onChangePrice={(value: number): void => {
                this.handleOnChangeInput('thumb1Input', value);
              }}
              onBlur={() => this.handleOnBlurInput('thumb1Input')}
              onFocus={() => this.handleOnFocusInput('thumb1Input')}
              price={this.formatNumber(thumb1InputValue)}
              align="left"
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
              align="left"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RangeSlider;
