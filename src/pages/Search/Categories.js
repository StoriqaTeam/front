// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { when, has, pathOr, filter, where, equals, map, evolve, pipe, path, assoc, assocPath, whereEq, reduce } from 'ramda';
import { createPaginationContainer, graphql } from 'react-relay';
import { withRouter, routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';
import { prepareGetUrl } from 'utils/search';
import log from 'utils/log';
import { Page } from 'components/App';
import { Accordion, prepareForAccordion } from 'components/Accordion';
import { RangerSlider } from 'components/Ranger';
import { CardProduct } from 'components/CardProduct';
import { AttributeControl } from 'components/AttributeControl';
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

const storesPerRequest = 24;

class Categories extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const priceRange = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'priceRange'], props);
    this.state = {
      volume: 0,
      volume2: priceRange.maxValue,
    };
  }

  generateTree = () => {
    const categories = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    if (!categories) return null;
    const level2Filter = filter(where({ level: equals(2), children: i => i.length !== 0 }));
    // const fltCats = flattenFunc(categories);
    const res = level2Filter(flattenFunc(categories));
    const result = prepareForAccordion(res);
    // console.log('**** fltCats: ', { fltCats, res, result });
    return result;
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

  // handleOnChangeAttribute = (attrFilter: AttrFilterType) => {
  //   const id = pathOr(null, ['attribute', 'id'], attrFilter);
  //   // const name = pathOr('', ['match', 'location', 'query', 'search'], this.props);
  //   // this.props.router.push(`/categories?search=${name}&minValue=${value}&maxValue=${value2}`);
  //   console.log('****** attribute filter on collback: ', attrFilter);
  //   return (value: string) => {
  //     if (id) {
  //       this.setState({
  //         [id]: value,
  //       });
  //     }
  //   };
  // }

  urlFromObj = (obj) => {
    // prepare range
    const range = pathOr(null, ['options', 'priceFilter'], obj);
    const pushRange = (str) => {
      if (range) {
        return `${str}&minValue=${range.minValue}&maxValue=${range.maxValue}`;
      }
      return str;
    };

    // prepare attrs
    const attrFilters = pathOr(null, ['options', 'attrFilters'], obj);
    const pushFilters = (str) => {
      // if (attrFilters) {
      //   return reduce((acc, next) => {
      //     return acc;
      //   }, `${str}&attrFilters=`, attrFilters);
      // //   return `${str}&minValue=${range.minValue}&maxValue=${range.maxValue}`;
      // }
      return str;
    };

    // pipe for result get str
    const newUrl = pipe(
      str => `${str}search=${obj.name}`,
      pushRange,
      pushFilters,
    )('?');
    return newUrl;
  }

  prepareUrlStr = (id, values) => {
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = prepareGetUrl(queryObj);
    const oldAttrs = pathOr([], ['options', 'attrFilters'], oldPreparedObj);
    const newPreparedObj = assocPath(['options', 'attrFilters'], [
      ...filter(whereEq({ id }), oldAttrs),
      {
        id,
        equal: {
          values,
        },
      },
    ], oldPreparedObj);
    const newUrl = this.urlFromObj(newPreparedObj);
    console.log('^^^^^^ prepareUrlStr newPreparedObj: ', { newPreparedObj });
    // console.log('****** prepareUrlStr ****** ');
    // console.log('^^^^^^ prepareUrlStr data: ', { id, value });
    // console.log('^^^^^^ prepareUrlStr result: ', { queryObj, oldPreparedObj, newPreparedObj });
    // console.log('****** prepareUrlStr ****** ');
    return newUrl;
  }

  handleOnChangeAttribute = (attrFilter: AttrFilterType) => {
    const id = pathOr(null, ['attribute', 'id'], attrFilter);
    // const name = pathOr('', ['match', 'location', 'query', 'search'], this.props);
    return (value: string) => {
      // const getStr = pathOr('', ['match', 'location', 'search'], this.props);
      // this.props.router.push(`/categories?search=${name}&minValue=${value}&maxValue=${value2}`);
      const newUrl = this.prepareUrlStr(id, value);
      console.log('****** attribute filter on collback: ', { id, value, newUrl });
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
    const attrFilters = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'attrFilters'], this.props);
    const accordionItems = this.generateTree();
    const products = pathOr(null, ['search', 'findProduct', 'edges'], this.props);
    // prepare arrays
    const variantsToArr = variantsName => pipe(
      path(['node']),
      i => assoc('storeId', i.rawId, i),
      evolve({
        variants: (i) => {
          if (variantsName === 'all') {
            return path([variantsName], i);
          }
          return [path([variantsName], i)];
        },
      }),
    );
    const productsWithVariants = map(variantsToArr('all'), products);
    // console.log('***** Categories accordionItems: ', { accordionItems });
    return (
      <div styleName="container">
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <Sidebar>
              {accordionItems &&
                <Accordion
                  items={accordionItems}
                  onClick={this.handleOnChangeCategory}
                  activeId={15}
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
                  <AttributeControl
                    attrFilter={attrFilter}
                    onChange={this.handleOnChangeAttribute(attrFilter)}
                    // onChange={() => this.handleOnChangeAttribute(attrFilter)}
                  />
                </div>
              ))}
            </Sidebar>
          </div>
          <div styleName="contentContainer">
            <div styleName="productsContainer">
              {productsWithVariants && productsWithVariants.map(item => (
                <div key={item.id} styleName="cardWrapper">
                  <CardProduct item={item} />
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
      first: { type: "Int", defaultValue: 24 }
      after: { type: "ID", defaultValue: null }
    ) {
      findProduct(searchTerm: $text, first: $first, after: $after) @connection(key: "Categories_findProduct") {
        pageInfo {
          searchFilters {
            categories {
              rawId
              level
              name {
                text
                lang
              }
              children {
                rawId
                level
                name {
                  text
                  lang
                }
                children {
                  rawId
                  level
                  name {
                    text
                    lang
                  }
                  children {
                    rawId
                    level
                    name {
                      text
                      lang
                    }
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
                rawId
                name {
                  text
                  lang
                }
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
            store {
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
