// @flow strict

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  fromPairs,
  map,
  pathOr,
  prop,
  pipe,
  replace,
  split,
  isNil,
} from 'ramda';
import { routerShape } from 'found';
// $FlowIgnoreMe
import uuidv4 from 'uuid/v4';

import { withShowAlert } from 'components/Alerts/AlertContext';
import {
  log,
  errorsHandler,
  fromRelayError,
  jwt as JWT,
  removeCookie,
  setCookie,
} from 'utils';
import Logo from 'components/Icon/svg/logo.svg';
import { Spinner } from 'components/common/Spinner';
import type { ResponseErrorType } from 'utils/fromRelayError';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { getJWTByProviderMutation } from './mutations';

import prepareQueryString from './OAuthCallback.utils';

import {
  getPathForRedirectAfterLogin,
  clearPathForRedirectAfterLogin,
  getAdditionalData,
} from '../utils';

import './OAuthCallback.scss';

import t from './i18n';

type PropsType = {
  provider: 'EMAIL' | 'FACEBOOK' | 'GOOGLE' | '%future added value',
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
};

// Component that handles code from oauth-providers and fetches jwt token.
class OAuthCallback extends PureComponent<PropsType> {
  componentDidMount() {
    let accessToken;
    switch (this.props.provider) {
      case 'FACEBOOK':
        accessToken = this.extractFacebookAccessToken(window.location.href);
        break;
      case 'GOOGLE':
        accessToken = this.extractGoogleAccessToken(window.location.href);
        break;
      default:
        break;
    }
    log.debug({ accessToken });
    if (accessToken) {
      getJWTByProviderMutation({
        environment: this.context.environment,
        variables: {
          input: {
            provider: this.props.provider,
            token: accessToken,
            clientMutationId: uuidv4(),
            additionalData: getAdditionalData(),
          },
        },
      })
        .then(response => {
          removeCookie('REFERAL');
          removeCookie('REFERER');
          removeCookie('UTM_MARKS');
          setCookie('registered', true);
          log.debug({ response });
          // $FlowIgnoreMe
          const jwtStr = pathOr(null, ['getJWTByProvider', 'token'], response);
          // eslint-disable-next-line
          if (jwtStr) {
            JWT.setJWT(jwtStr);
            const redirectPath = getPathForRedirectAfterLogin();
            if (!isNil(redirectPath)) {
              clearPathForRedirectAfterLogin();
              this.props.router.push(decodeURIComponent(redirectPath));
            } else {
              window.location.href = '/'; // TODO: use refetch or store update
            }
          }
          // throw new Error('no JWT');
        })
        .catch((errs: ResponseErrorType) => {
          log.error(errs);
          const relayErrors = fromRelayError({ source: { errors: [errs] } });
          if (relayErrors) {
            errorsHandler(relayErrors, this.props.showAlert);
          }
          this.props.router.replace('/login');
        });
    } else {
      window.location.href = '/login';
    }
  }

  extractFacebookAccessToken = (url: string) => {
    // <callback_url from .env>?#access_token=<token_here>&expires_in=6232
    // $FlowIgnore
    const fbCallbackUri: string =
      process.env.REACT_APP_OAUTH_FACEBOOK_REDIRECT_URI;
    const queryString = prepareQueryString({ url, callbackUrl: fbCallbackUri });
    return this.extractToken(queryString);
  };

  extractGoogleAccessToken = (url: string) => {
    // <callback_url from .env>#access_token=<token_here>&token_type=Bearer&expires_in=3600
    // $FlowIgnore
    const googleCallbackUri: string =
      process.env.REACT_APP_OAUTH_GOOGLE_REDIRECT_URI;
    const queryString = replace(`${googleCallbackUri}#`, '', url);
    return this.extractToken(queryString);
  };

  // pass query string here
  extractToken = pipe(
    split('&'), // [access_token=<token_here>, expires_in=6232]
    map(split('=')), // [[access_token, <token_here>], [expires_in, 6232]]
    fromPairs, // {access_token: <token_here>, expires_in: 6232}
    prop('access_token'), // <token_here>
  );

  render() {
    return (
      <div styleName="container">
        <div styleName="logo">
          <Logo />
        </div>
        <span styleName="text">
          {t.loading}
          <br />
          {t.pleaseWait}
        </span>
        <span styleName="description">- {t.storiqaTeam}</span>
        <Spinner />
      </div>
    );
  }
}

OAuthCallback.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(OAuthCallback);
