// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';
import { setCookie, getCookie } from 'utils';
import moment from 'moment';

import {
  AppContext,
  Header,
  Main,
  Footer,
  UserData,
  HeaderDisclaimer,
} from 'components/App';

import './PageDecorator.scss';

type PropsType = {
  me: ?{},
};

export default (
  OriginalComponent: any,
  config: { withoutCategories: ?boolean } = { withoutCategories: false },
) =>
  class Page extends PureComponent<PropsType> {
    constructor(props: PropsType) {
      super(props);

      const cookieLocale = getCookie('locale');
      if (!cookieLocale) {
        if (process.env.BROWSER) {
          // const browserLang = window.navigator
          //   ? window.navigator.language ||
          //     window.navigator.systemLanguage ||
          //     window.navigator.userLanguage
          //   : null;
          // const browserLocale = browserLang
          //   ? browserLang.substr(0, 2).toLowerCase()
          //   : 'en';
          // setCookie(
          //   'locale',
          //   browserLocale,
          //   moment()
          //     .utc()
          //     .add(30, 'd')
          //     .toDate(),
          // );

          // убрать потом
          setCookie(
            'locale',
            'en',
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
            <UserData environment={environment} me={this.props.me}>
              {({ isShopCreated, userData, totalCount }) => (
                <div styleName="container">
                  {process.env.NODE_ENV === 'production' && (
                    <HeaderDisclaimer />
                  )}
                  <Header
                    isShopCreated={isShopCreated}
                    userData={userData}
                    totalCount={totalCount}
                    searchValue={pathOr(
                      '',
                      ['match', 'location', 'query', 'search'],
                      this.props,
                    )}
                    withoutCategories={config.withoutCategories}
                    setLang={this.setLang}
                  />
                  <Main>
                    <OriginalComponent {...this.props} />
                  </Main>
                  <Footer isShopCreated={isShopCreated} />
                </div>
              )}
            </UserData>
          )}
        </AppContext.Consumer>
      );
    }
  };
