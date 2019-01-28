// @flow

import React, { Component } from 'react';
import { assocPath, omit, path, assoc } from 'ramda';
import classNames from 'classnames';
import { CardElement, injectStripe } from 'react-stripe-elements';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { Input, Button } from 'components/common';
import { formatPrice, log } from 'utils';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import './CheckoutForm.scss';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  stripe: {
    handleCardPayment: (
      clientSecret: string,
      cardData: any,
      sourceData: any,
    ) => Promise<*>,
  },
  amount: number,
  currency: string,
  email: string,
  name: string,
  onPaid: () => void,
  paymentIntent: {
    id: string,
    clientSecret: string,
  },
};

type StateType = {
  ownerName: string,
  ownerEmail: string,
  completeCard: boolean,
  isFocus: boolean,
  errors: {
    [string]: Array<string>,
  },
  isLoading: boolean,
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

class CheckoutForm extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);

    const { email, name } = props;

    this.state = {
      ownerName: name,
      ownerEmail: email,
      completeCard: false,
      isFocus: false,
      errors: {},
      isLoading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  cardElement: any;

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { paymentIntent } = this.props;
    const { ownerName: name, ownerEmail: email } = this.state;

    this.props.stripe
      .handleCardPayment(paymentIntent.clientSecret, this.cardElement, {
        source_data: {
          owner: {
            name,
            email,
          },
        },
      })
      .then(payload => {
        if (payload && payload.error) {
          this.props.showAlert({
            type: 'danger',
            text: payload.error.message || 'Something going wrong',
            link: { text: 'Closed.' },
          });
          return true;
        }
        this.props.onPaid();
        return true;
      })
      .finally(() => {
        this.setState({ isLoading: false });
      })
      .catch(log.error);
  };

  handleBlur = () => {
    this.setState({ isFocus: false });
  };

  handleChange = change => {
    this.setState((prevState: StateType) => ({
      errors: omit(['card'], prevState.errors),
    }));
    if (change.error) {
      this.setState((prevState: StateType) => ({
        errors: assoc('card', change.error.message, prevState.errors),
      }));
    }
    this.setState({ completeCard: change.complete });
  };

  handleClick = () => {};

  handleFocus = () => {
    this.setState({ isFocus: true });
  };

  handleReady = (element: any) => {
    if (element) {
      this.cardElement = element;
    }
  };

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ errors: omit([id], this.state.errors) });
    const { value } = e.target;
    this.setState((prevState: StateType) => assocPath([id], value, prevState));
  };

  isDisabledButton = (): boolean => {
    const { ownerName, ownerEmail, completeCard } = this.state;
    return ownerName === '' || ownerEmail === '' || !completeCard;
  };

  renderInput = (props: { id: string, label: string, required?: boolean }) => {
    const { id, label, required } = props;
    const hereLabel = required ? (
      <span>
        {label} <span styleName="asterisk">*</span>
      </span>
    ) : (
      label
    );
    const value = path([id], this.state);
    const errors = path(['errors', id], this.state);
    return (
      <Input
        id={id}
        value={value || ''}
        label={hereLabel}
        onChange={this.handleInputChange(id)}
        errors={errors}
        fullWidth
      />
    );
  };

  render() {
    const { amount, currency } = this.props;
    const { isFocus, isLoading, errors } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        styleName={classNames('container', { isFocus, isError: errors.card })}
      >
        <label>
          <div styleName="label">
            Card details <span styleName="asterisk">*</span>
          </div>
          <div styleName={classNames('cardElement', { isFocus })}>
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
        </label>
        <div styleName="input">
          {this.renderInput({
            id: 'ownerName',
            label: 'Name',
            required: true,
          })}
        </div>
        <div styleName="input">
          {this.renderInput({
            id: 'ownerEmail',
            label: 'Email',
            required: true,
          })}
        </div>
        <div styleName="footer">
          <div styleName="button">
            <Button
              type="submit"
              fullWidth
              dataTest="payButton"
              isLoading={isLoading}
              disabled={this.isDisabledButton()}
            >
              Pay
            </Button>
          </div>
          <div styleName="amount">
            {formatPrice(amount)} {currency}
          </div>
        </div>
      </form>
    );
  }
}

export default withShowAlert(injectStripe(CheckoutForm));
