// @flow

import React, { Component } from 'react';
import { withRouter, routerShape } from 'found';
import { createFragmentContainer, graphql, Relay } from 'react-relay';
import { map, pathOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Container, Row, Col } from 'layout';
import { MobileSidebar } from 'components/MobileSidebar';
import { Page } from 'components/App';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';

import './About.scss';

// import type { Stores_search as SearchType } from './__generated__/Stores_search.graphql';

type SelectedType = {
  //
};

type PropsType = {
  router: routerShape,
};

type StateType = {
  category: ?SelectedType,
  isSidebarOpen: boolean,
};

class StoreAbout extends Component<PropsType, StateType> {
  render() {
    console.log('---this.props', this.props);
    return <div styleName="container">About</div>;
  }
}

export default createFragmentContainer(
  withRouter(StoreAbout),
  graphql`
    fragment StoreAbout_store on Store {
      id
      rawId
      name {
        lang
        text
      }
      addressFull {
        value
        country
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
        placeId
      }
      longDescription {
        lang
        text
      }
    }
  `,
);
