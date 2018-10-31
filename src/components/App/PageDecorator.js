// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';
import { setCookie, getCookie } from 'utils';
import moment from 'moment';

import {
  AppContext,
  Header,
  HeaderResponsive,
  Main,
  Footer,
  FooterResponsive,
  UserData,
  HeaderDisclaimer,
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
    constructor(props: PropsType) {
      super(props);

      const cookieLocale = getCookie('locale');
      if (!cookieLocale) {
        if (process.env.BROWSER) {
          const browserLang = window.navigator
            ? window.navigator.language ||
              window.navigator.systemLanguage ||
              window.navigator.userLanguage
            : null;
          const browserLocale = browserLang
            ? browserLang.substr(0, 2).toLowerCase()
            : 'en';
          setCookie(
            'locale',
            browserLocale,
            moment()
              .utc()
              .add(30, 'd')
              .toDate(),
          );
        } else {
          setCookie(
            'locale',
            'en',
            moment()
              .utc()
              .add(30, 'd')
              .toDate(),
          );
        }
      }
    }

    setLang = (lang: string) => {
      const locale = getCookie('locale');
      if (locale && locale.value !== lang && process.env.BROWSER) {
        setCookie(
          'locale',
          lang,
          moment()
            .utc()
            .add(30, 'd')
            .toDate(),
        );
        window.location.reload();
      }
    };

    render() {
      return (
        <AppContext.Consumer>
          {({ environment }) => (
            <UserData environment={environment}>
              {({ isShopCreated, userData, totalCount }) => (
                <div styleName="container">
                  {process.env.NODE_ENV === 'production' && (
                    <HeaderDisclaimer />
                  )}
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
                      setLang={this.setLang}
                    />
                  ) : (
                    <Header
                      currentLocale="en"
                      setLang={() => {}}
                      user={this.props.me}
                      // $FlowIgnoreMe
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
