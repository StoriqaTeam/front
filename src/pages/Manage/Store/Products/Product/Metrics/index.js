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

  render() {
    const {
      lengthCm,
      widthCm,
      heightCm,
      weightG,
    } = this.props;

    const {
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
              <InputNumber
                id="weightG"
                value={weightG}
                onChange={(value: number) => {
                  this.handleOnChangeMetrics('weightG', value);
                }}
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
                <InputNumber
                  id="widthCm"
                  value={widthCm}
                  onChange={(value: number) => {
                    this.handleOnChangeMetrics('widthCm', value);
                  }}
                  onFocus={this.handleOnFocusDimension}
                  onBlur={this.handleOnBlurDimension}
                  fullWidth
                />
                <div styleName="sign">{t.width}</div>
              </div>
              <div styleName="input">
                <InputNumber
                  id="lengthCm"
                  value={lengthCm}
                  onChange={(value: number) => {
                    this.handleOnChangeMetrics('lengthCm', value);
                  }}
                  onFocus={this.handleOnFocusDimension}
                  onBlur={this.handleOnBlurDimension}
                  fullWidth
                />
                <div styleName="sign">{t.length}</div>
              </div>
              <div styleName="input">
                <InputNumber
                  id="heightCm"
                  value={heightCm}
                  onChange={(value: number) => {
                    this.handleOnChangeMetrics('heightCm', value);
                  }}
                  onFocus={this.handleOnFocusDimension}
                  onBlur={this.handleOnBlurDimension}
                  fullWidth
                />
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
