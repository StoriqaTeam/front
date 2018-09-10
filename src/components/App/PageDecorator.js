// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import {
  AppContext,
  Header,
  HeaderResponsive,
  Main,
  Footer,
  FooterResponsive,
  UserData,
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
        <AppContext.Consumer>
          {({ environment }) => (
            <UserData environment={environment}>
              {({ isShopCreated, userData, totalCount }) => (
                <div styleName="container">
                  {responsive ? (
                    <HeaderResponsive
                      isShopCreated={isShopCreated}
                      userData={userData}
                      totalCount={totalCount}
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
                  {responsive ? (
                    <FooterResponsive isShopCreated={isShopCreated} />
                  ) : (
                    <Footer />
                  )}
                </div>
              )}
            </UserData>
          )}
        </AppContext.Consumer>
      );
    }
  };
