// @flow

import React, { Component } from 'react';
import { routerShape, matchShape, withRouter } from 'found';
import { assocPath, pathOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Select } from 'components/common/Select';

import { urlToInput, inputToUrl } from 'utils';

import type { SelectItemType } from 'types';
import type { Stores_search as SearchType } from '../__generated__/Stores_search.graphql';

import { fromQueryString, fromSearchFilters } from '../StoreUtils';

import './StoresSidebar.scss';

import t from './i18n';

type PropsType = {
  router: routerShape,
  match: matchShape,
  search: SearchType,
  onClose: () => void,
};

type StateType = $Shape<{
  category: SelectItemType,
  categories: Array<SelectItemType>,
  country: SelectItemType,
  countries: Array<SelectItemType>,
}>;

class StoresSidebar extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    const { search, match } = this.props;
    const categories = fromSearchFilters(search, ['category', 'children']);
    const countries = fromSearchFilters(search, ['country']);
    this.state = {
      categories,
      countries,
    };
    const country = fromQueryString(match, 'country')(countries, 'label');
    if (country) {
      this.state.country = country;
    }
    const category = fromQueryString(match, 'category')(categories, 'id');
    if (category) {
      this.state.category = category;
    }
  }
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
    const { onClose } = this.props;
    const { categories, countries, category, country } = this.state;
    return (
      <div styleName="container">
        <div>
          <div styleName="filterItem">
            <Select
              forSearch
              withEmpty
              label={t.labelCategories}
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
              label={t.labelLocation}
              activeItem={country}
              items={countries}
              onSelect={item => this.handleClick('country', item)}
              dataTest="storesLocationSelect"
            />
          </div>
        </div>
        <div styleName="apply">
          <Button
            wireframe
            big
            onClick={onClose}
            dataTest="apply"
            style={{ width: '100%' }}
          >
            {t.apply}
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(StoresSidebar);
