// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import cx from 'classnames';
import ResizeObserver from 'resize-observer-polyfill';

import { Input } from 'components/common/Input';

import { capitalize, clamp } from './utils';

import './RangerSlider.scss';

const constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      coordinate: 'x',
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      coordinate: 'y',
    },
  },
};

type PropsType = {
  minValue: number,
  maxValue: number,
  min: number,
  max: number,
  step: number,
  value: number,
  value2: number,
  orientation: string,
  className: string,
  onChange: Function,
  onChange2: Function,
  onChangeStart: Function,
  onChangeComplete: Function,
};

type StateType = {
  limit: number,
  grab: number,
  minValue: number,
  maxValue: number,
  focusInput: ?string,
};

class RangerSlider extends Component<PropsType, StateType> {
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    value2: 0,
    orientation: 'horizontal',
  };

  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    if (nextProps.value !== prevState.minValue) {
      return { ...prevState, minValue: nextProps.value };
    }
    if (nextProps.value2 !== prevState.maxValue) {
      return { ...prevState, maxValue: nextProps.value2 };
    }
    return null;
  }

  constructor(props: PropsType, context: any) {
    super(props, context);
    this.state = {
      limit: 0,
      grab: 0,
      minValue: props.value,
      maxValue: props.value2,
      focusInput: null,
    };

    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentDidMount() {
    this.handleUpdate();
    const resizeObserver = new ResizeObserver(this.handleUpdate);
    resizeObserver.observe(this.slider);
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  getPositionFromValue = (value: number) => {
    const { limit } = this.state;
    const { min, max } = this.props;
    const diffMaxMin = max - min;
    const diffValMin = value - min;
    const percentage = diffValMin / diffMaxMin;
    const pos = Math.round(percentage * limit);
    return pos;
  };

  getValueFromPosition = (pos: number, buttonNumber: number) => {
    const { limit } = this.state;
    const { orientation, min, max, step, value, value2 } = this.props;

    if (buttonNumber === 1) {
      const percentage = clamp(pos, 0, limit) / (limit || 1);
      const baseVal = step * Math.round(percentage * (max - min) / step);
      const newValue =
        orientation === 'horizontal' ? baseVal + min : max - baseVal;
      return clamp(newValue < value2 ? newValue : value2, min, max);
    }
    const percentage = clamp(pos, min, limit) / (limit || 1);
    const baseVal = step * Math.round(percentage * (max - min) / step);
    const newValue =
      orientation === 'horizontal' ? baseVal + min : max - baseVal;
    return clamp(newValue > value ? newValue : value, min, max);
  };

  slider: any;
  handle: any;
  handle2: any;
  labels: any;
  input: Node;
  input2: Node;

  handleKeydown = (e: any): void => {
    const { onChange, onChange2 } = this.props;
    const { focusInput, minValue, maxValue } = this.state;
    if (e.keyCode === 13 && focusInput) {
      if (focusInput === 'min') {
        onChange(minValue);
        // $FlowIgnore
        this.input.blur();
        return;
      }
      if (focusInput === 'max') {
        onChange2(maxValue);
        // $FlowIgnore
        this.input2.blur();
      }
    }
  };

  handleUpdate = () => {
    if (!this.slider) {
      // for shallow rendering
      return;
    }
    const { orientation } = this.props;
    const dimension = capitalize(constants.orientation[orientation].dimension);
    const sliderPos = this.slider[`offset${dimension}`];
    const handlePos = this.handle[`offset${dimension}`];
    this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2,
    });
  };

  handleStart = (e: Event) => {
    const { onChangeStart } = this.props;
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);
    if (onChangeStart) onChangeStart(e);
  };

  handleStart2 = (e: Event) => {
    const { onChangeStart } = this.props;
    document.addEventListener('mousemove', this.handleDrag2);
    document.addEventListener('mouseup', this.handleEnd2);
    if (onChangeStart) onChangeStart(e);
  };

  handleDrag = (e: any) => {
    e.stopPropagation();
    const { onChange } = this.props;
    const value = this.position(e, 1);
    if (onChange) onChange(value, e);
  };

  handleDrag2 = (e: any) => {
    e.stopPropagation();
    const { onChange2 } = this.props;
    const value = this.position(e, 2);
    if (onChange2) onChange2(value, e);
  };

  handleEnd = () => {
    const { onChangeComplete, value, value2 } = this.props;
    if (onChangeComplete) onChangeComplete(value, value2);
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleEnd);
  };

  handleEnd2 = () => {
    const { onChangeComplete, value, value2 } = this.props;
    if (onChangeComplete) onChangeComplete(value, value2);
    document.removeEventListener('mousemove', this.handleDrag2);
    document.removeEventListener('mouseup', this.handleEnd2);
  };

  position = (e: any, buttonNumber: number) => {
    const { grab } = this.state;
    const { orientation } = this.props;
    const node = this.slider;
    const coordinateStyle = constants.orientation[orientation].coordinate;
    const directionStyle = constants.orientation[orientation].direction;
    const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`;
    const coordinate = !e.touches
      ? e[clientCoordinateStyle]
      : e.touches[0][clientCoordinateStyle];
    const direction = node.getBoundingClientRect()[directionStyle];
    const pos = coordinate - direction - grab;
    const newValue = this.getValueFromPosition(pos, buttonNumber);
    return newValue;
  };

  coordinates = (pos: number, buttonNumber: number) => {
    const { limit, grab } = this.state;
    const { orientation } = this.props;
    const value = this.getValueFromPosition(pos, buttonNumber);
    const position = this.getPositionFromValue(value);
    const handlePos = orientation === 'horizontal' ? position + grab : position;
    const fillPos =
      orientation === 'horizontal' ? handlePos : limit - handlePos;
    return {
      fill: fillPos,
      handle: handlePos,
      label: handlePos,
    };
  };

  handleInputChange = (type: string, e: any) => {
    const { value } = e.target;
    if (type === 'min') {
      this.setState({ minValue: value });
    }
    if (type === 'max') {
      this.setState({ maxValue: value });
    }
  };

  handleInputFocus = (type: string) => {
    this.setState({ focusInput: type });
  };

  handleInputBlur = (type: string) => {
    const {
      onChange,
      onChange2,
      onChangeComplete,
      minValue: minValueFromProps,
      maxValue: maxValueFromProps,
    } = this.props;
    const { minValue, maxValue } = this.state;
    if (type === 'min') {
      onChange(minValue);
    }
    if (type === 'max') {
      onChange2(maxValue);
    }
    onChangeComplete(
      minValue < minValueFromProps ? minValueFromProps : minValue,
      maxValue > maxValueFromProps ? maxValueFromProps : maxValue,
    );
    this.setState({ focusInput: null });
  };

  render() {
    const { value, value2, orientation, className, min, max } = this.props;
    const { minValue, maxValue } = this.state;
    const { direction } = constants.orientation[orientation];
    const position = this.getPositionFromValue(value);
    const position2 = this.getPositionFromValue(value2);
    const coords = this.coordinates(position, 1);
    const coords2 = this.coordinates(position2, 2);
    const fillStyle = {
      marginLeft: `${coords.fill}px`,
      width: `${coords2.fill - coords.fill}px`,
    };
    const handleStyle = {
      [direction]: `${coords.handle}px`,
      zIndex: coords.handle >= 100 ? 999 : 1,
    };
    const handleStyle2 = {
      [direction]: `${coords2.handle}px`,
      zIndex: coords2.handle < 100 ? 999 : 1,
    };

    return (
      <div styleName="rangerContainer">
        <div
          role="slider"
          tabIndex="-1"
          ref={s => {
            this.slider = s;
          }}
          styleName={cx(
            'rangeslider',
            { rangesliderHorizontal: orientation === 'horizontal' },
            { rangesliderVertical: orientation === 'vertical' },
            className,
          )}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-orientation={orientation}
        >
          <div styleName="rangesliderFill" style={fillStyle} />
          <div
            role="button"
            ref={sh => {
              this.handle = sh;
            }}
            styleName="rangesliderHandle"
            onMouseDown={this.handleStart}
            onTouchMove={this.handleDrag}
            onTouchEnd={this.handleEnd}
            style={handleStyle}
            tabIndex={0}
          />
          <div
            role="button"
            ref={sh => {
              this.handle2 = sh;
            }}
            styleName="rangesliderHandle2"
            onMouseDown={this.handleStart2}
            onTouchMove={this.handleDrag2}
            onTouchEnd={this.handleEnd2}
            style={handleStyle2}
            tabIndex={0}
          />
        </div>
        <div styleName="valuesContainer">
          <div styleName="leftValue">
            <Input
              inputRef={(el: Node) => {
                this.input = el;
              }}
              id="min-value"
              type="number"
              value={`${minValue}`}
              onChange={(e: any) => {
                this.handleInputChange('min', e);
              }}
              onBlur={() => {
                this.handleInputBlur('min');
              }}
              onFocus={() => {
                this.handleInputFocus('min');
              }}
              fullWidth
            />
          </div>
          <div styleName="rightValue">
            <Input
              inputRef={(el: Node) => {
                this.input2 = el;
              }}
              id="max-value"
              type="number"
              value={`${maxValue}`}
              onChange={(e: any) => {
                this.handleInputChange('max', e);
              }}
              onBlur={() => {
                this.handleInputBlur('max');
              }}
              onFocus={() => {
                this.handleInputFocus('max');
              }}
              fullWidth
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RangerSlider;
