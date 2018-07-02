import React, { Component } from 'react';
import { routerShape, withRouter } from 'found';
import { addIndex, assocPath, find, isEmpty, map, pathOr, propEq } from 'ramda';

import { Select } from 'components/common/Select';

import { urlToInput, inputToUrl, extractText } from 'utils';

import type { Stores_search as SearchType } from './__generated__/Stores_search.graphql';

import './StoresSidebar.scss';

type PropsType = {
  router: routerShape,
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
    const { search } = nextProps;
    const rawCategories = pathOr(
      [],
      ['findStore', 'pageInfo', 'searchFilters', 'category', 'children'],
      search,
    );
    const categories = map(item => {
      const name = extractText(item.name);
      return {
        id: `${item.rawId}`,
        label: !isEmpty(name) ? name : '',
      };
    }, rawCategories);
    const category = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      nextProps,
    );
    if (category) {
      return {
        ...nextState,
        category: find(propEq('id', category))(categories),
      };
    }
    const rawCountries = pathOr(
      [],
      ['findStore', 'pageInfo', 'searchFilters', 'country'],
      search,
    );
    const mapIndexed = addIndex(map);
    const countries = mapIndexed(
      (item, idx) => ({
        id: `${idx}`,
        label: item,
      }),
      rawCountries,
    );
    const country = pathOr(
      null,
      ['match', 'location', 'query', 'country'],
      nextProps,
    );
    if (country) {
      return {
        ...nextState,
        country: find(propEq('label', country))(countries),
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
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const isCountry = stateName === 'country';
    const pathPiece = isCountry ? stateName : 'categoryId';
    const propPiece = isCountry ? 'label' : 'id';
    const oldPreparedObj = urlToInput(queryObj);
    const newPreparedObj = assocPath(
      ['options', pathPiece],
      item ? item[propPiece] : null,
      oldPreparedObj,
    );
    const newUrl = inputToUrl(newPreparedObj);
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
