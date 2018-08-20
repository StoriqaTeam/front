// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';
import { setCookie, getCookie } from 'utils';

import {
  AppContext,
  Header,
  HeaderResponsive,
  Main,
  Footer,
  FooterResponsive,
  LangContext,
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

      /**
     * @desc Uncomment later!

    const cookieLocale = pathOr(null, ['value'], getCookie('locale'));
    if (!cookieLocale) {
      if (process.env.BROWSER) {
        const browserLang = window.navigator ? (window.navigator.language ||
          window.navigator.systemLanguage ||
          window.navigator.userLanguage) : null;
        const browserLocale = browserLang ? browserLang.substr(0, 2).toLowerCase() : 'en';
        setCookie('locale', browserLocale);
      } else {
        setCookie('locale', 'en');
      }
    }
     */

      /**
       * @desc And this is to remove!
       */
      setCookie('locale', 'en');
    }

    setLang = (lang: string) => {
      const locale = getCookie('locale');
      if (locale && locale.value !== lang && process.env.BROWSER) {
        setCookie('locale', lang);
        window.location.reload();
      }
    };

    render() {
      return (
        <AppContext.Consumer>
          {({ environment }) => (
            <LangContext.Provider
              value={{
                setLang: this.setLang,
              }}
            >
              <LangContext.Consumer>
                {() => (
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
                        setLang={this.setLang}
                      />
                    ) : (
                      <Header
                        user={this.props.me}
                        searchValue={pathOr(
                          '',
                          ['match', 'location', 'query', 'search'],
                          this.props,
                        )}
                        setLang={this.setLang}
                      />
                    )}
                    <Main>
                      <OriginalComponent {...this.props} />
                    </Main>
                    {responsive ? <FooterResponsive /> : <Footer />}
                  </div>
                )}
              </LangContext.Consumer>
            </LangContext.Provider>
          )}
        </AppContext.Consumer>
      );
    }
  };
