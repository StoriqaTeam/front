// @flow

import React, { Component } from 'react';
import { routerShape, matchShape, withRouter } from 'found';
import { assocPath, pathOr } from 'ramda';

import { Select } from 'components/common/Select';

import { urlToInput, inputToUrl } from 'utils';

import type { Stores_search as SearchType } from './__generated__/Stores_search.graphql';

import './StoresSidebar.scss';
import { fromQueryString, fromSearchFilters } from './StoreUtils';

type PropsType = {
  router: routerShape,
  // eslint-disable-next-line
  match: matchShape,
  // eslint-disable-next-line
  search: SearchType,
};

type StateType = {
  category: string,
  categories: string,
  country: string,
  countries: string,
};

class StoresSidebar extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(
    nextProps: PropsType,
    nextState: StateType,
  ): StateType | null {
    const { search, match } = nextProps;
    const categories = fromSearchFilters(search, ['category', 'children']);
    const category = fromQueryString(match, 'category')(categories, 'id');
    if (category) {
      return {
        ...nextState,
        category,
      };
    }
    const countries = fromSearchFilters(search, ['country']);
    const country = fromQueryString(match, 'country')(countries, 'label');
    if (country) {
      return {
        ...nextState,
        country,
      };
    }
    return {
      ...nextState,
      categories,
      countries,
    };
  }
  state = {
    category: '',
    categories: '',
    country: '',
    countries: '',
  };
  handleClick = (
    stateName: string,
    item: { id: string, label: string },
  ): void => {
    // $FlowIgnore
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const isCountry = stateName === 'country';
    const pathPiece = isCountry ? stateName : 'categoryId';
    const propPiece = isCountry ? 'label' : 'id';
    const oldQueryObj = urlToInput(queryObj);
    const newQueryObj = assocPath(
      ['options', pathPiece],
      item ? item[propPiece] : null,
      oldQueryObj,
    );
    const newUrl = inputToUrl(newQueryObj);
    this.setState({ [stateName]: item }, () => {
      this.push(newUrl);
    });
  };
  push = (url: string): void => {
    const {
      router: { push },
    } = this.props;
    push(`/stores${url}`);
  };
  render() {
    const { categories, countries, category, country } = this.state;
    return (
      <div styleName="container">
        <div styleName="filterItem">
          <Select
            forSearch
            withEmpty
            label="Categories"
            activeItem={category}
            items={categories}
            onSelect={item => this.handleClick('category', item)}
            dataTest="storesCategoriesSelect"
          />
        </div>
        <div styleName="filterItem">
          <Select
            forSearch
            withEmpty
            label="Location"
            activeItem={country}
            items={countries}
            onSelect={item => this.handleClick('country', item)}
            dataTest="storesLocationSelect"
          />
        </div>
      </div>
    );
  }
}

export default withRouter(StoresSidebar);
