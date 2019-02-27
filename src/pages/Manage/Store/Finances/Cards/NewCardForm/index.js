// @flow

import React, { Component } from 'react';
import { assocPath, omit, path, assoc } from 'ramda';
import classNames from 'classnames';
import { injectStripe, CardElement } from 'react-stripe-elements';

import { Stripe } from 'pages/common/StripeDecorator';
import { Input, Button } from 'components/common';
import { log } from 'utils';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import './NewCardForm.scss';

type PropsType = {
  name: string,
  email: string,
  showAlert: (input: AddAlertInputType) => void,
  stripe: {
    createToken: ({
      name: string,
      email?: string,
    }) => Promise<*>,
  },
  isCards: boolean,
  onCancel: () => void,
  onSave: (token: any) => void,
  isLoading: boolean,
  wizard?: boolean,
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

class NewCardForm extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);

    const { name, email } = props;

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

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean = false;
  cardElement: any;

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { ownerName: name, ownerEmail: email } = this.state;
    log.debug(name, email);

    this.props.stripe
      .createToken({
        name,
      })
      .then((payload: any) => {
        this.props.onSave(payload.token);
        return true;
      })
      .finally(() => {
        if (this.mounted) {
          this.setState({ isLoading: false });
        }
      })
      .catch(log.error);
  };

  handleBlur = () => {
    this.setState({ isFocus: false });
  };

  handleChange = (change: any) => {
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
    const { onCancel, isCards, wizard } = this.props;
    const { isFocus, isLoading, errors } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        styleName={classNames('container', {
          isFocus,
          isError: errors.card,
          wizard,
        })}
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
        {/*
          <div styleName="input">
            {this.renderInput({
              id: 'ownerEmail',
              label: 'Email',
              required: true,
            })}
          </div>
        */}
        <div styleName="footer">
          <div styleName="button">
            <Button
              type="submit"
              fullWidth
              dataTest="payButton"
              isLoading={isLoading || this.props.isLoading}
              disabled={this.isDisabledButton()}
            >
              Save
            </Button>
          </div>
          {isCards && (
            <div
              styleName="cancelButton"
              onClick={onCancel}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              Cancel
            </div>
          )}
        </div>
      </form>
    );
  }
}

export default Stripe(injectStripe(NewCardForm));
