// @flow strict

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { InputNumber } from 'components/common';
import FormItemTitle from 'pages/common/FormItemTitle';

import './Metrics.scss';

import t from './i18n';

type StateType = {
  isWeightFocus: boolean,
  isDimensionFocus: boolean,
};

type PropsType = {
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  weightG: number,
  onChangeMetrics: (metrics: {
    lengthCm: number,
    widthCm: number,
    heightCm: number,
    weightG: number,
  }) => void,
};

class Metrics extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      isWeightFocus: false,
      isDimensionFocus: false,
    };
  }

  handleOnChangeMetrics = (id: string, value: number) => {
    const { weightG, lengthCm, widthCm, heightCm } = this.props;
    const metrics = { weightG, lengthCm, widthCm, heightCm };
    this.props.onChangeMetrics({
      ...metrics,
      [id]: value,
    });
  };

  handleOnFocusWeight = () => {
    this.setState({ isWeightFocus: true });
  };

  handleOnBlurWeight = () => {
    this.setState({ isWeightFocus: false });
  };

  handleOnFocusDimension = () => {
    this.setState({ isDimensionFocus: true });
  };

  handleOnBlurDimension = () => {
    this.setState({ isDimensionFocus: false });
  };

  renderDimensionInput = (id: string, value: number) => (
    <InputNumber
      id={id}
      value={value}
      onChange={(dimensionValue: number) => {
        this.handleOnChangeMetrics(id, dimensionValue);
      }}
      onFocus={this.handleOnFocusDimension}
      onBlur={this.handleOnBlurDimension}
      limit={3}
      limitHidden
      fullWidth
    />
  );

  render() {
    const { lengthCm, widthCm, heightCm, weightG } = this.props;

    const { isWeightFocus, isDimensionFocus } = this.state;

    return (
      <div styleName="container">
        <FormItemTitle title={t.metrics} />
        <div styleName="body">
          <div styleName="weight">
            <div styleName={classNames('label', { labelFloat: isWeightFocus })}>
              {t.weight} <span styleName="asteriks">*</span>
            </div>
            <div styleName="weightInput">
              <InputNumber
                id="weightG"
                value={weightG}
                onChange={(value: number) => {
                  this.handleOnChangeMetrics('weightG', value);
                }}
                onFocus={this.handleOnFocusWeight}
                onBlur={this.handleOnBlurWeight}
                limit={6}
                limitHidden
                fullWidth
              />
              <div styleName="unit">{t.g}</div>
            </div>
          </div>
          <div styleName="dimensions">
            <div
              styleName={classNames('label', { labelFloat: isDimensionFocus })}
            >
              {t.dimensions} <span styleName="asteriks">*</span>
            </div>
            <div styleName="dimensionInputs">
              <div styleName="input">
                {this.renderDimensionInput('widthCm', widthCm)}
                <div styleName="sign">{t.width}</div>
              </div>
              <div styleName="input">
                {this.renderDimensionInput('lengthCm', lengthCm)}
                <div styleName="sign">{t.length}</div>
              </div>
              <div styleName="input">
                {this.renderDimensionInput('heightCm', heightCm)}
                <div styleName="sign">{t.height}</div>
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
