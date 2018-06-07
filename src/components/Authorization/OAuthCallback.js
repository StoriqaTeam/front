// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { fromPairs, map, pathOr, prop, pipe, replace, split } from 'ramda';
import Cookies from 'universal-cookie';
import { routerShape } from 'found';

import { withShowAlert } from 'components/App/AlertContext';
import { log } from 'utils';
import { GetJWTByProviderMutation } from 'relay/mutations';
import Logo from 'components/Icon/svg/logo.svg';
import { Spinner } from 'components/common/Spinner';

import type { AddAlertInputType } from 'components/App/AlertContext';

import './OAuthCallback.scss';

type PropsType = {
  provider: string,
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
      GetJWTByProviderMutation.commit({
        provider: this.props.provider,
        token: accessToken,
        environment: this.context.environment,
        onCompleted: (response: ?Object, errors: ?Array<Error>) => {
          log.debug({ response, errors });
          if (errors) {
            this.props.showAlert({
              type: 'danger',
              text: 'Something going wrong.',
              link: { text: 'Close.' },
            });
            return;
          }
          const jwt = pathOr(null, ['getJWTByProvider', 'token'], response);
          if (jwt) {
            const cookies = new Cookies();
            const today = new Date();
            const expirationDate = new Date();
            expirationDate.setDate(today.getDate() + 1);
            cookies.set(
              '__jwt',
              { value: jwt },
              {
                path: '/',
                expires: expirationDate,
              },
            );
            window.location.href = '/'; // TODO: use refetch or store update
          }
        },
        onError: (error: Error) => {
          log.error(error);
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong.',
            link: { text: 'Close.' },
          });
          this.props.router.replace('/login');
        },
      });
    } else {
      window.location.href = '/login';
    }
  }

  extractFacebookAccessToken = (url: string) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // <callback_url from .env>?#access_token=<token_here>&expires_in=6232
    // $FlowIgnore
    const fbCallbackUri: string =
      process.env.REACT_APP_OAUTH_FACEBOOK_REDIRECT_URI;
    const queryString = replace(
      `${fbCallbackUri}${isSafari ? '' : '?'}#`,
      '',
      url,
    );
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
          Loading...<br />Please wait.
        </span>
        <span styleName="description">- Storiqa team</span>
        <Spinner />
      </div>
    );
  }
}

OAuthCallback.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(OAuthCallback);
