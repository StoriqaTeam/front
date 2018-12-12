// @flow strict

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { Input } from 'components/common';
import FormItemTitle from 'pages/common/FormItemTitle';

import './Metrics.scss';

import t from './i18n';

type StateType = {
  weight: string,
  width: string,
  length: string,
  height: string,
  isWeightFocus: boolean,
  isDimensionFocus: boolean,
};

type PropsType = {
  //
};

class Metrics extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      weight: '0',
      width: '0',
      length: '0',
      height: '0',
      isWeightFocus: false,
      isDimensionFocus: false,
    };
  }

  handleOnChangeWeight = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState({ weight: value });
  };

  handleOnChangeDimension = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log('---id, value', id, value);
    this.setState({ [id]: value });
  };

  handleOnFocusWeight = () => {
    this.setState({ isWeightFocus: true });
  };

  handleOnFocusDimension = () => {
    this.setState({ isDimensionFocus: true });
  };

  handleOnBlurWeight = () => {
    this.setState({ isWeightFocus: false });
  };

  handleOnBlurDimension = () => {
    this.setState({ isDimensionFocus: false });
  };

  render() {
    const {
      weight,
      width,
      length,
      height,
      isWeightFocus,
      isDimensionFocus,
    } = this.state;

    return (
      <div styleName="container">
        <FormItemTitle title={t.metrics} />
        <div styleName="body">
          <div styleName="weight">
            <div styleName={classNames('label', { labelFloat: isWeightFocus })}>
              Weight
            </div>
            <div styleName="weightInput">
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={this.handleOnChangeWeight}
                onFocus={this.handleOnFocusWeight}
                onBlur={this.handleOnBlurWeight}
                fullWidth
              />
              <div styleName="unit">{t.g}</div>
            </div>
          </div>
          <div styleName="dimensions">
            <div
              styleName={classNames('label', { labelFloat: isDimensionFocus })}
            >
              Dimensions
            </div>
            <div styleName="dimensionInputs">
              <div styleName="input">
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={this.handleOnChangeDimension}
                  onFocus={this.handleOnFocusDimension}
                  onBlur={this.handleOnBlurDimension}
                  fullWidth
                />
              </div>
              <div styleName="input">
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={this.handleOnChangeDimension}
                  onFocus={this.handleOnFocusDimension}
                  onBlur={this.handleOnBlurDimension}
                  fullWidth
                />
              </div>
              <div styleName="input">
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={this.handleOnChangeDimension}
                  onFocus={this.handleOnFocusDimension}
                  onBlur={this.handleOnBlurDimension}
                  fullWidth
                />
              </div>
              <div styleName="unit">{t.sm}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Metrics;
