// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';
import { setCookie } from 'utils';

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

type StateType = {
  currentLocale: string,
};

type PropsType = {
  me: ?{},
};

export default (
  OriginalComponent: any,
  responsive: ?boolean,
  withoutCategories: ?boolean,
) =>
  class Page extends PureComponent<PropsType, StateType> {
    constructor(props: PropsType) {
      super(props);

      /**
     * @desc Uncomment later!

    const cookieLocale = pathOr(null, ['value'], getCookie('locale'));
    if (cookieLocale) {
      // $FlowIgnore
      this.state = { currentLocale: cookieLocale };
    } else if (process.env.BROWSER) {
      const browserLang = window.navigator ? (window.navigator.language ||
        window.navigator.systemLanguage ||
        window.navigator.userLanguage) : null;
      const browserLocale = browserLang ? browserLang.substr(0, 2).toLowerCase() : 'en';
      this.state = { currentLocale: browserLocale };
      setCookie('locale', browserLocale);
    } else {
      this.state = { currentLocale: 'en' };
      setCookie('locale', 'en');
    }

     */

      /**
       * @desc And this is to remove!
       */
      this.state = { currentLocale: 'en' };
      setCookie('locale', 'en');
    }

    setLang = (lang: string) => {
      setCookie('locale', lang);
      this.setState({ currentLocale: lang });
    };

    render() {
      const { currentLocale } = this.state;
      return (
        <AppContext.Consumer>
          {({ environment }) => (
            <LangContext.Provider
              value={{
                setLang: this.setLang,
                currentLocale,
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
                        currentLocale={currentLocale}
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
                        currentLocale={currentLocale}
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
