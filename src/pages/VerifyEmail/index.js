// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, routerShape } from 'found';
import { pathOr } from 'ramda';

import Logo from 'components/Icon/svg/logo.svg';
import { VerifyEmailMutation } from 'relay/mutations';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Spinner } from 'components/common/Spinner';
import { log } from 'utils';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { setEmailTracker } from 'rrHalper';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { VerifyEmailMutationParamsType } from 'relay/mutations/VerifyEmailMutation';
import type { VerifyEmailMutationResponse } from 'relay/mutations/__generated__/VerifyEmailMutation.graphql';

import './index.scss';

type StateType = {
  isTokenResponseAlreadyHandled: boolean, // prevent double verify
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  params: { token: string },
  router: routerShape,
};

class VerifyEmail extends Component<PropsType, StateType> {
  state: StateType = {
    isTokenResponseAlreadyHandled: false,
  };

  componentDidMount() {
    if (this.state.isTokenResponseAlreadyHandled) {
      return;
    }

    const params: VerifyEmailMutationParamsType = {
      variables: {
        input: {
          clientMutationId: '',
          token: this.props.params.token,
        },
      },
      environment: this.context.environment,
      onCompleted: (
        response: ?VerifyEmailMutationResponse,
        errors: ?Array<Error>,
      ) => {
        log.debug({ response, errors });
        this.setState({ isTokenResponseAlreadyHandled: true });
        if (response && response.verifyEmail && response.verifyEmail.success) {
          this.props.showAlert({
            type: 'success',
            text: 'Verified successfully. Please login with your login data.',
            link: { text: '' },
          });
          this.props.router.replace('/');
          const { email } = response.verifyEmail;
          if (
            process.env.BROWSER &&
            process.env.REACT_APP_RRPARTNERID &&
            email
          ) {
            setEmailTracker(email);
          }
        } else if (errors && errors.length > 0) {
          // $FlowIgnoreMe
          const errorMessage = pathOr(
            null,
            [0, 'data', 'details', 'message'],
            errors,
          );
          log.debug({ errorMessage });
          this.props.showAlert({
            type: 'danger',
            text: errorMessage || 'Something going wrong',
            link: { text: 'Close.' },
          });
          this.props.router.replace('/');
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.setState({ isTokenResponseAlreadyHandled: true });
        if (error) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong',
            link: { text: 'Close.' },
          });
          this.props.router.replace('/');
        }
      },
    };
    VerifyEmailMutation.commit(params);
  }

  render() {
    return (
      <div>
        <div styleName="container">
          <div styleName="logo">
            <Logo />
          </div>
          <span styleName="text">
            Loading...<br />Please wait.
          </span>
          <span styleName="description">- Storiqa team</span>
          <Spinner />
        </div>
      </div>
    );
  }
}

VerifyEmail.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(withErrorBoundary(withRouter(VerifyEmail)));
