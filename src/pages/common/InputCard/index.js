// @flow strict

import React, { Component } from 'react';
import classNames from 'classnames';
// $FlowIgnore
import { CardElement } from 'react-stripe-elements';

import './InputCard.scss';

type StateType = {
  isFocus: boolean,
};

type PropsType = {
  onBlur: () => void,
  onChange: () => void,
  onFocus: () => void,
  onReady: () => void,
  errors: {
    [string]: Array<string>,
  },
  isRequired?: boolean,
};

const cardElementOptional = {
  style: {
    base: {
      fontSize: '14px',
      color: '#505050',
      letterSpacing: '1px',
      fontFamily: 'Roboto',
      '::placeholder': {
        color: '#D3D2D3',
      },
    },
    invalid: {
      color: '#E62C6D',
    },
  },
};

class InputCard extends Component<PropsType, StateType> {
  state = {
    isFocus: false,
  };

  cardElement: *;

  handleBlur = () => {
    this.setState({ isFocus: false });
  };

  handleChange = () => {};

  handleFocus = () => {
    this.setState({ isFocus: true });
  };

  handleReady = (element: *) => {
    if (element) {
      this.cardElement = element;
    }
  };

  render() {
    const { errors, isRequired } = this.props;
    const { isFocus } = this.state;

    return (
      <div styleName={classNames('cardElement', { isFocus })}>
        <div styleName="label">
          {`Card details`}
          {isRequired === true && <span styleName="asterisk"> *</span>}
        </div>
        <CardElement
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onReady={this.handleReady}
          {...cardElementOptional}
        />
        <hr />
        {errors.card && <div styleName="cardError">{errors.card}</div>}
      </div>
    );
  }
}

export default InputCard;
