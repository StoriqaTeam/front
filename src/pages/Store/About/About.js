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

class Store extends Component<PropsType, StateType> {
  render() {
    return <div styleName="container">About</div>;
  }
}

export default createFragmentContainer(
  withRouter(Page(Store)),
  graphql`
    fragment StoreAbout_me on User
      @argumentDefinitions(storeId: { type: "Int" }) {
      store(id: $storeId) {
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
    }
  `,
);
