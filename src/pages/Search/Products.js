// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { createPaginationContainer, graphql } from 'react-relay';
import { withRouter, routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';
import log from 'utils/log';
import { Page } from 'components/App';
import { RangerSlider } from 'components/Ranger';
import { CardProduct } from 'components/CardProduct';
import { AttributeControll } from 'components/AttributeControll';

import CategoriesMenu from './CategoriesMenu';
import Sidebar from './Sidebar';

import './Products.scss';

type PropsType = {
  router: routerShape,
}

type StateType = {
  volume: number,
  volume2: number,
}

type TranslateType = {
  text: string,
  lang: string
}

type AttrFilterType = {
  id: string,
  name: Array<TranslateType>,
  metaField: ?{
    values: ?Array<string>,
    translatedValues: ?Array<TranslateType>,
    uiElement: string,
  },
}

const storesPerRequest = 20;

class Products extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const priceRange = pathOr(null, ['search', 'findProductInCategory', 'pageInfo', 'searchFilters', 'priceRange'], props);
    this.state = {
      volume: 0,
      volume2: priceRange.maxValue,
    };
  }

  handleOnChangeCategory = item => log.info(item);

  handleOnRangeChange = (value: number, fieldName: string) => {
    this.setState({
      [fieldName]: value,
    });
  }

  handleOnCompleteRange = (value: number, value2: number, e: Event) => {
    log.info({ value, value2 }, e);
    const name = pathOr('', ['match', 'location', 'query', 'search'], this.props);
    const category = pathOr('', ['match', 'location', 'query', 'category'], this.props);
    this.props.router.push(`/products?search=${name}&category=${category}&minValue=${value}&maxValue=${value2}`);
  }

  handleOnChangeAttribute = (attrFilter: AttrFilterType) => {
    const id = pathOr(null, ['attribute', 'id'], attrFilter);
    return (value: string) => {
      if (id) {
        this.setState({
          [id]: value,
        });
      }
    };
  }

  render() {
    const { volume, volume2 } = this.state;
    const priceRange = pathOr(null, ['search', 'findProductInCategory', 'pageInfo', 'searchFilters', 'priceRange'], this.props);
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    const attrFilters = pathOr(null, ['data', 'search', 'findProduct', 'searchFilters', 'attrFilters'], this.props);
    const products = pathOr(null, ['search', 'findProductInCategory', 'edges'], this.props);
    return (
      <div styleName="container">
        {categories && <CategoriesMenu categories={categories} />}
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <Sidebar>
              <div styleName="blockTitle">Цена (STQ)</div>
              <RangerSlider
                min={0}
                max={priceRange.maxValue}
                step={0.01}
                value={volume}
                value2={volume2}
                onChange={value => this.handleOnRangeChange(value, 'volume')}
                onChange2={value => this.handleOnRangeChange(value, 'volume2')}
                onChangeComplete={this.handleOnCompleteRange}
              />
              {attrFilters && attrFilters.map(attrFilter => (
                <div key={attrFilter.attribute.id} styleName="attrBlock">
                  <AttributeControll
                    attrFilter={attrFilter}
                    onChange={this.handleOnChangeAttribute(attrFilter)}
                  />
                </div>
              ))}
            </Sidebar>
          </div>
          <div styleName="contentContainer">
            <div styleName="productsContainer">
              {products && products.map(item => (
                <div key={item.node.id} styleName="cardWrapper">
                  <CardProduct item={item.node} />
                </div>
              ))}
              <div styleName="loadMoreContainer">
                <div styleName="loadMoreButton">Load more</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Products.contextTypes = {
  directories: PropTypes.object,
  currentUser: currentUserShape,
};


export default createPaginationContainer(
  withRouter(Page(Products)),
  graphql`
    fragment Products_search on Search
    @argumentDefinitions(
      text: { type: "SearchProductInsideCategoryInput!" }
      first: { type: "Int", defaultValue: 20 }
      after: { type: "ID", defaultValue: null }
    ) {
      findProductInCategory(searchTerm: $text, first: $first, after: $after) @connection(key: "Products_findProductInCategory", filters: ["searchTerm"]) {
        edges {
          node {
            id
            baseProduct {
              id
              rawId
              currencyId
              name {
                text
                lang
              }
            }
            variants {
              id
              rawId
              product {
                id
                rawId
                discount
                photoMain
                cashback
                price
              }
            }
          }
        }
        pageInfo {
          searchFilters {
            priceRange {
              minValue
              maxValue
            }
            attrFilters {
              attribute {
                id
                name {
                  text
                  lang
                }
                valueType
                metaField {
                  uiElement
                }
              }
              equal {
                values
              }
              range {
                minValue
                maxValue
              }
            }
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => props.search && props.search.findProductInCategory,
    getVariables: (props, { count }, prevFragmentVars) => ({
      text: prevFragmentVars.text,
      first: count + storesPerRequest,
      after: props.search.findProductInCategory.pageInfo.endCursor,
    }),
    query: graphql`
      query Products_edges_Query($first: Int, $after: ID, $text: SearchProductInsideCategoryInput!) {
        search {
          ...Products_search @arguments(first: $first, after: $after, text: $text)
        }
      }
    `,
  },
);
