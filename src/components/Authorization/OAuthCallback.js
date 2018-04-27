// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { fromPairs, map, pathOr, prop, pipe, replace, split } from 'ramda';
import Cookies from 'universal-cookie';
import { routerShape } from 'found';

import { log } from 'utils';
import { GetJWTByProviderMutation } from 'relay/mutations';
import Logo from 'components/Icon/svg/logo.svg';

import './OAuthCallback.scss';

type PropsType = {
  provider: string,
  router: routerShape,
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
          const jwt = pathOr(null, ['getJWTByProvider', 'token'], response);
          if (jwt) {
            const cookies = new Cookies();
            cookies.set('__jwt', { value: jwt }, { path: '/' });
            window.location.href = '/'; // TODO: use refetch or store update
          }
        },
        onError: (error: Error) => {
          log.error(error);
          alert('Something going wrong.'); // eslint-disable-line
          this.props.router.replace('/login');
        },
      });
    } else {
      window.location.href = '/login';
    }
  }

  extractFacebookAccessToken = (url: string) => {
    // <callback_url from .env>?#access_token=<token_here>&expires_in=6232
    // $FlowIgnore
    const fbCallbackUri: string = process.env.REACT_APP_OAUTH_FACEBOOK_REDIRECT_URI;
    const queryString = replace(`${fbCallbackUri}#`, '', url);
    return this.extractToken(queryString);
  };

  extractGoogleAccessToken = (url: string) => {
    // <callback_url from .env>#access_token=<token_here>&token_type=Bearer&expires_in=3600
    // $FlowIgnore
    const googleCallbackUri: string = process.env.REACT_APP_OAUTH_GOOGLE_REDIRECT_URI;
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
        <span styleName="text">Loading...<br />Please wait.</span>
        <span styleName="description">- Storiqa team</span>
        <div styleName="spinner">
          <div styleName="double-bounce1" />
          <div styleName="double-bounce2" />
        </div>
      </div>
    );
  }
}

OAuthCallback.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default OAuthCallback;
