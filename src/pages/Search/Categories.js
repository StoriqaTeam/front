// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, filter, where, equals } from 'ramda';
import { createPaginationContainer, graphql } from 'react-relay';
import { withRouter, routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';
import log from 'utils/log';
import { Page } from 'components/App';
import { Accordion, prepareForAccordion } from 'components/Accordion';
import { RangerSlider } from 'components/Ranger';
import { CardProduct } from 'components/CardProduct';
import { AttributeControll } from 'components/AttributeControll';
import { flattenFunc } from 'utils';

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

class Categories extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const priceRange = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'priceRange'], props);
    log.info('******* ^^^^^^^ props: ', props);
    this.state = {
      volume: 0,
      volume2: priceRange.maxValue,
    };
  }

  generateTree = () => {
    const categories = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    if (!categories) return null;
    const level2Filter = filter(where({ level: equals(2), children: i => i.length !== 0 }));
    const res = level2Filter(flattenFunc(categories));
    return prepareForAccordion(res);
  }

  handleOnChangeCategory = (item) => {
    const { volume, volume2 } = this.state;
    const name = pathOr('', ['match', 'location', 'query', 'search'], this.props);
    this.props.router.push(`/products?search=${name}&category=${item.id}&minValue=${volume}&maxValue=${volume2}`);
  };

  handleOnRangeChange = (value: number, fieldName: string) => {
    this.setState({
      [fieldName]: value,
    });
  }

  handleOnCompleteRange = (value: number, value2: number, e: Event) => {
    log.info({ value, value2 }, e);
    const name = pathOr('', ['match', 'location', 'query', 'search'], this.props);
    this.props.router.push(`/categories?search=${name}&minValue=${value}&maxValue=${value2}`);
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
    const priceRange = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'priceRange'], this.props);
    const attrFilters = pathOr(null, ['data', 'search', 'findProduct', 'searchFilters', 'attrFilters'], this.props);
    const catTree = this.generateTree();
    const products = pathOr(null, ['search', 'findProduct', 'edges'], this.props);
    return (
      <div styleName="container">
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <Sidebar>
              {catTree &&
                <Accordion
                  tree={catTree}
                  onClick={this.handleOnChangeCategory}
                />
              }
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

Categories.contextTypes = {
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default createPaginationContainer(
  withRouter(Page(Categories)),
  graphql`
    fragment Categories_search on Search
    @argumentDefinitions(
      text: { type: "SearchProductInput!" }
      first: { type: "Int", defaultValue: 20 }
      after: { type: "ID", defaultValue: null }
    ) {
      findProduct(searchTerm: $text, first: $first, after: $after) @connection(key: "Categories_findProduct") {
        pageInfo {
          searchFilters {
            categories {
              children {
                children {
                  rawId
                  children {
                    rawId
                  }
                }
              }
            }
            priceRange {
              minValue
              maxValue
            }
            attrFilters {
              attribute {
                id
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
        edges {
          node {
            id
            rawId
            currencyId
            name {
              text
              lang
            }
            category {
              rawId
            }
            variants {
              all {
                id
                rawId
                discount
                photoMain
                cashback
                price
                attributes {
                  attribute {
                    id
                  }
                  value
                  
                }
              }
            }
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => props.search && props.search.findProduct,
    getVariables: (props, { count }, prevFragmentVars) => ({
      text: prevFragmentVars.text,
      first: count + storesPerRequest,
      after: props.search.findProduct.pageInfo.endCursor,
    }),
    query: graphql`
      query Categories_edges_Query($first: Int, $after: ID, $text: SearchProductInput!) {
        search {
          ...Categories_search @arguments(first: $first, after: $after, text: $text)
        }
      }
    `,
  },
);
