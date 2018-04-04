// @flow

/* eslint no-debugger: "warn" */
import cx from 'classnames';
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import { capitalize, clamp } from './utils';

import './RangerSlider.scss';

/**
 * Predefined constants
 * @type {Object}
 */
const constants = {
  orientation: {
    horizontal: {
      dimension: 'width',
      direction: 'left',
      reverseDirection: 'right',
      coordinate: 'x',
    },
    vertical: {
      dimension: 'height',
      direction: 'top',
      reverseDirection: 'bottom',
      coordinate: 'y',
    },
  },
};

type PropsType = {
  min: number,
  max: number,
  step: number,
  value: number,
  orientation: string,
  tooltip: boolean,
  reverse: boolean,
  labels: {},
  // labels: PropTypes.shape({
  //   foo: { bar: {} },
  // }),
  handleLabel: string,
  className: string,
  format: Function,
  onChangeStart: Function,
  onChange: Function,
  onChangeComplete: Function,
};

type StateType = {
  active: boolean,
  limit: number,
  grab: number,
}

class Slider extends Component<PropsType, StateType> {
  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    orientation: 'horizontal',
    tooltip: true,
    reverse: false,
    labels: {},
    handleLabel: '',
  };

  constructor(props: PropsType, context: any) {
    super(props, context);
    this.state = {
      active: false,
      limit: 0,
      grab: 0,
    };
  }

  componentDidMount() {
    this.handleUpdate();
    const resizeObserver = new ResizeObserver(this.handleUpdate);
    resizeObserver.observe(this.slider);
  }

  /**
   * Calculate position of slider based on its value
   * @param  {number} value - Current value of slider
   * @return {position} pos - Calculated position of slider based on value
   */
  getPositionFromValue = (value: number) => {
    const { limit } = this.state;
    const { min, max } = this.props;
    const diffMaxMin = max - min;
    const diffValMin = value - min;
    const percentage = diffValMin / diffMaxMin;
    const pos = Math.round(percentage * limit);
    return pos;
  };

  /**
   * Translate position of slider to slider value
   * @param  {number} pos - Current position/coordinates of slider
   * @return {number} value - Slider value
   */
  getValueFromPosition = (pos: number) => {
    const { limit } = this.state;
    const {
      orientation,
      min,
      max,
      step,
    } = this.props;
    const percentage = clamp(pos, 0, limit) / (limit || 1);
    const baseVal = step * Math.round((percentage * (max - min)) / step);
    const value = orientation === 'horizontal' ? baseVal + min : max - baseVal;
    return clamp(value, min, max);
  };

  slider: any;
  handle: any;
  labels: any;
  tooltip: any;

  /**
   * Format label/tooltip value
   * @param  {Number} - value
   * @return {Formatted Number}
   */
  handleFormat = (value: number) => {
    const { format } = this.props;
    return format ? format(value) : value;
  };

  /**
   * Update slider state on change
   * @return {void}
   */
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

  /**
   * Attach event listeners to mousemove/mouseup events
   * @return {void}
   */
  handleStart = (e: Event) => {
    const { onChangeStart } = this.props;
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleEnd);
    this.setState({
      active: true,
    }, () => onChangeStart && onChangeStart(e));
  };

  /**
   * Handle drag/mousemove event
   * @param  {Object} e - Event object
   * @return {void}
   */
  handleDrag = (e: any) => {
    e.stopPropagation();
    const { onChange } = this.props;
    const { target: { className, classList, dataset } } = e;
    console.log('^^^ handleDrag ', { className, classList, dataset });
    if (!onChange || className === 'rangesliderLabels') return;

    let value = this.position(e);

    if (
      classList &&
      classList.contains('rangesliderLabelItem') &&
      dataset.value
    ) {
      value = parseFloat(dataset.value);
    }
    if (onChange) onChange(value, e);
  };

  /**
   * Detach event listeners to mousemove/mouseup events
   * @return {void}
   */
  handleEnd = (e: Event) => {
    const { onChangeComplete } = this.props;
    this.setState({
      active: false,
    }, () => onChangeComplete && onChangeComplete(e));
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleEnd);
  };

  /**
   * Support for key events on the slider handle
   * @param  {Object} e - Event object
   * @return {void}
   */
  handleKeyDown = (e: any) => {
    e.preventDefault();
    const { keyCode } = e;
    const {
      value,
      min,
      max,
      step,
      onChange,
    } = this.props;
    let sliderValue;

    switch (keyCode) {
      case 38:
      case 39:
        sliderValue = value + step > max ? max : value + step;
        if (onChange) onChange(sliderValue, e);
        break;
      case 37:
      case 40:
        sliderValue = value - step < min ? min : value - step;
        if (onChange) onChange(sliderValue, e);
        break;
      default:
        break;
    }
  };

  /**
   * Calculate position of slider based on value
   * @param  {Object} e - Event object
   * @return {number} value - Slider value
   */
  position = (e: any) => {
    const { grab } = this.state;
    const { orientation, reverse } = this.props;

    const node = this.slider;
    const coordinateStyle = constants.orientation[orientation].coordinate;
    const directionStyle = reverse
      ? constants.orientation[orientation].reverseDirection
      : constants.orientation[orientation].direction;
    const clientCoordinateStyle = `client${capitalize(coordinateStyle)}`;
    const coordinate = !e.touches
      ? e[clientCoordinateStyle]
      : e.touches[0][clientCoordinateStyle];
    const direction = node.getBoundingClientRect()[directionStyle];
    const pos = reverse
      ? direction - coordinate - grab
      : coordinate - direction - grab;
    const value = this.getValueFromPosition(pos);
    console.log('^^^ position clientCoordinateStyle: ', {
      clientCoordinateStyle,
      directionStyle,
      coordinateStyle,
      coordinate,
      direction,
      pos,
      value,
    });
    return value;
  };

  /**
   * Grab coordinates of slider
   * @param  {Object} pos - Position object
   * @return {Object} - Slider fill/handle coordinates
   */
  coordinates = (pos: number) => {
    const { limit, grab } = this.state;
    const { orientation } = this.props;
    const value = this.getValueFromPosition(pos);
    const position = this.getPositionFromValue(value);
    const handlePos = orientation === 'horizontal' ? position + grab : position;
    const fillPos = orientation === 'horizontal'
      ? handlePos
      : limit - handlePos;
    return {
      fill: fillPos,
      handle: handlePos,
      label: handlePos,
    };
  };

  renderLabels = (labels: any) => (
    <ul
      ref={(sl) => {
        this.labels = sl;
      }}
      styleName={cx('rangesliderLabels')}
    >
      {labels}
    </ul>
  );

  render() {
    const {
      value,
      orientation,
      className,
      tooltip,
      reverse,
      labels,
      min,
      max,
      handleLabel,
    } = this.props;
    const { active } = this.state;
    const { dimension } = constants.orientation[orientation];
    const direction = reverse
      ? constants.orientation[orientation].reverseDirection
      : constants.orientation[orientation].direction;
    const position = this.getPositionFromValue(value);
    const coords = this.coordinates(position);
    const fillStyle = { [dimension]: `${coords.fill}px` };
    const handleStyle = { [direction]: `${coords.handle}px` };
    const showTooltip = tooltip && active;

    let labelItems = [];
    let labelKeys = Object.keys(labels);

    // console.log('&&&& labels: ', { labels });

    if (labelKeys.length > 0) {
      labelKeys = labelKeys.sort((a, b) => (reverse ? a - b : b - a));

      labelItems = labelKeys.map((key) => {
        const labelPosition = this.getPositionFromValue(key);
        const labelCoords = this.coordinates(labelPosition);
        const labelStyle = { [direction]: `${labelCoords.label}px` };
        return (
          <li
            key={key}
            role="presentation"
            styleName="rangesliderLabelItem"
            data-value={key}
            onMouseDown={this.handleDrag}
            onTouchStart={this.handleStart}
            onTouchEnd={this.handleEnd}
            style={labelStyle}
          >
            {this.props.labels[key]}
          </li>
        );
      });
    }

    return (
      <div
        role="slider"
        tabIndex="-1"
        ref={(s) => {
          this.slider = s;
        }}
        styleName={cx(
          'rangeslider',
          { rangesliderHorizontal: orientation === 'horizontal' },
          { rangesliderVertical: orientation === 'vertical' },
          { rangesliderReverse: reverse },
          className,
        )}
        onMouseDown={this.handleDrag}
        onMouseUp={this.handleEnd}
        onTouchStart={this.handleStart}
        onTouchEnd={this.handleEnd}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-orientation={orientation}
      >
        <div styleName="rangesliderFill" style={fillStyle} />
        <div
          role="button"
          ref={(sh) => {
            this.handle = sh;
          }}
          styleName="rangesliderHandle"
          onMouseDown={this.handleStart}
          onTouchMove={this.handleDrag}
          onTouchEnd={this.handleEnd}
          onKeyDown={this.handleKeyDown}
          style={handleStyle}
          tabIndex={0}
        >
          {/* {showTooltip ?
            <div
              ref={(st) => {
                this.tooltip = st;
              }}
              styleName="rangesliderHandleTooltip"
            >
              <span>{this.handleFormat(value)}</span>
            </div>
            : null} */}
          {/* <div styleName="rangesliderHandleLabel">{handleLabel}</div> */}
          {/* <div>{handleLabel}</div> */}
        </div>
        {labels ? this.renderLabels(labelItems) : null}
      </div>
    );
  }
}

export default Slider;
