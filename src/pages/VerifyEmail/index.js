// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, routerShape } from 'found';
import { pathOr } from 'ramda';

import Logo from 'components/Icon/svg/logo.svg';
import { VerifyEmailMutation } from 'relay/mutations';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { log } from 'utils';

import type { VerifyEmailMutationParamsType } from 'relay/mutations/VerifyEmailMutation';
import type { VerifyEmailMutationResponse } from 'relay/mutations/__generated__/VerifyEmailMutation.graphql';

import './index.scss';

type StateType = {
  isTokenResponseAlreadyHandled: boolean, // prevent double verify
};

type PropsType = {
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
          alert('Verified successfully. Please login with your login data.'); // eslint-disable-line
          this.props.router.replace('/');
        } else if (errors && errors.length > 0) {
          const errorMessage = pathOr(
            null,
            [0, 'data', 'details', 'message'],
            errors,
          );
          log.debug({ errorMessage });
          alert(errorMessage || 'Something going wrong'); // eslint-disable-line
          this.props.router.replace('/');
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.setState({ isTokenResponseAlreadyHandled: true });
        if (error) {
          alert('Something going wrong'); // eslint-disable-line
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
          <div styleName="spinner">
            <div styleName="double-bounce1" />
            <div styleName="double-bounce2" />
          </div>
        </div>
      </div>
    );
  }
}

VerifyEmail.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withErrorBoundary(withRouter(VerifyEmail));
