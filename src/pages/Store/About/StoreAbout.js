// @flow

import React, { Component } from 'react';
import { withRouter } from 'found';
import { createFragmentContainer, graphql } from 'react-relay';
// import { map, pathOr } from 'ramda';

import './About.scss';

// import type { Stores_search as SearchType } from './__generated__/Stores_search.graphql';

type SelectedType = {
  //
};

type PropsType = {
  // router: routerShape,
};

type StateType = {
  category: ?SelectedType,
  isSidebarOpen: boolean,
};
// eslint-disable-next-line
class StoreAbout extends Component<PropsType, StateType> {
  render() {
    // console.log('---this.props', this.props);
    return <div styleName="container">About</div>;
  }
}

export default createFragmentContainer(
  withRouter(StoreAbout),
  graphql`
    fragment StoreAbout_shop on Store {
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
