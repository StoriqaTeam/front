// @flow

import React, { PureComponent } from 'react';
import {isNil, pathOr} from 'ramda';

import {
  AppContext,
  Header,
  HeaderResponsive,
  Main,
  Footer,
  FooterResponsive,
} from 'components/App';

import './Page.scss';
import {extractText} from "../../pages/Store/Product/utils";

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
        <AppContext.Consumer>
          {({ environment }) => (
            <div styleName="container">
              {responsive ? (
                <HeaderResponsive
                  environment={environment}
                  user={this.props.me}
                  searchValue={pathOr(
                    '',
                    ['match', 'location', 'query', 'search'],
                    this.props,
                  )}
                  withoutCategories={withoutCategories}
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
              <Main>
                <OriginalComponent {...this.props} />
              </Main>
              {responsive ? <FooterResponsive /> : <Footer />}
            </div>
          )}
        </AppContext.Consumer>
      );
    }
  };
