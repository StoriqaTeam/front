// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import {
  Header,
  HeaderResponse,
  Main,
  Footer,
  FooterResponse,
} from 'components/App';

import './Page.scss';

type PropsType = {
  me: ?{},
};

export default (
  OriginalComponent: any,
  responsive: ?boolean,
  withoutCategories: ?boolean,
) =>
  class Page extends PureComponent<PropsType> {
    render() {
      return (
        <div styleName="container">
          {responsive ? (
            <HeaderResponse
              user={this.props.me}
              searchValue={pathOr(
                '',
                ['match', 'location', 'query', 'search'],
                this.props,
              )}
            />
          ) : (
            <Header
              user={this.props.me}
              searchValue={pathOr(
                '',
                ['match', 'location', 'query', 'search'],
                this.props,
              )}
            />
          )}
          <Main responsive={responsive} withoutCategories={withoutCategories}>
            <OriginalComponent {...this.props} />
          </Main>
          {responsive ? <FooterResponse /> : <Footer />}
        </div>
      );
    }
  };
