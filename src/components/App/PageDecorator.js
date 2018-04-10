// @flow

import React, { PureComponent } from 'react';
import { pathOr } from 'ramda';

import { Header, Main, Footer } from 'components/App';

import './Page.scss';

type PropsType = {
  me: ?{},
};

export default (OriginalComponent: any, withoutCategories: ?boolean) =>
  class Page extends PureComponent<PropsType> {
    render() {
      return (
        <div styleName="container">
          <Header
            user={this.props.me}
            searchValue={pathOr('', ['location', 'query', 'search'], this.props)}
          />
          <Main withoutCategories={withoutCategories}>
            <OriginalComponent {...this.props} />
          </Main>
          <Footer />
        </div>
      );
    }
  };
