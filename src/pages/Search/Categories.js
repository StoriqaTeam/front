// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { sort, pathOr, filter, where, equals, map, evolve, pipe, path, assoc, assocPath, whereEq, complement } from 'ramda';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { withRouter, routerShape } from 'found';

import { flattenFunc, urlToInput, inputToUrl, getNameText, searchPathByParent, log } from 'utils';
import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Accordion, prepareForAccordion } from 'components/Accordion';
import { Button } from 'components/common/Button';
import { RangerSlider } from 'components/Ranger';
import { CardProduct } from 'components/CardProduct';
import { AttributeControl } from 'components/AttributeControl';

import './Categories.scss';

type PropsType = {
  router: routerShape,
  relay: Relay,
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
    const res = level2Filter(flattenFunc(categories));
    const result = prepareForAccordion(res);
    return result;
  }

  handleOnChangeCategory = (item) => {
    const { volume, volume2 } = this.state;
    const name = pathOr('', ['match', 'location', 'query', 'search'], this.props);
    this.props.router.push(`/categories?search=${name}&category=${item.id}&minValue=${volume}&maxValue=${volume2}`);
  };

  handleOnRangeChange = (value: number, fieldName: string) => {
    this.setState({
      [fieldName]: value,
    });
  }

  handleOnCompleteRange = (value: number, value2: number, e: Event) => {
    log.info({ value, value2 }, e);
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);
    const newPreparedObj = assocPath(['options', 'priceFilter'], {
      minValue: value,
      maxValue: value2,
    }, oldPreparedObj);
    const newUrl = inputToUrl(newPreparedObj);
    this.props.router.push(`/categories${newUrl}`);
  }

  prepareUrlStr = (id, values) => {
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);
    const oldAttrs = pathOr([], ['options', 'attrFilters'], oldPreparedObj);
    const newPreparedObj = assocPath(['options', 'attrFilters'], [
      ...filter(complement(whereEq({ id })), oldAttrs),
      {
        id,
        equal: {
          values,
        },
      },
    ], oldPreparedObj);
    return inputToUrl(newPreparedObj);
  }

  handleOnChangeAttribute = (attrFilter: AttrFilterType) => {
    const id = pathOr(null, ['attribute', 'id'], attrFilter);
    const rawId = pathOr(null, ['attribute', 'rawId'], attrFilter);
    return (value: string) => {
      const newUrl = this.prepareUrlStr(rawId, value);
      this.props.router.push(`/categories${newUrl}`);
      if (id) {
        this.setState({
          [id]: value,
        });
      }
    };
  }

  productsRefetch = () => {
    this.props.relay.loadMore(24);
  };

  renderBreadcrumbs = () => {
    // const { categoryRowId } = this.props;
    // const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    // const categories = pathOr(null, ['data', 'categories', 'children'], categoriesMock);
    const categoryId = pathOr(null, ['match', 'location', 'query', 'category'], this.props);
    const categories = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    if (!categories || !categoryId) {
      return null;
    }
    const arr = flattenFunc(categories);
    const pathArr = searchPathByParent(arr, parseInt(categoryId, 10));
    console.log('**** render breadcrumbs pathArr: ', pathArr);
    return (
      <div styleName="breadcrumbs">
        <p styleName="item">Все категрии</p>
        {pathArr.length !== 0 &&
          pathArr.map(item => (
            <div
              key={item.rawId}
              styleName={classNames('item', { active: item.rawId === parseInt(categoryId, 10) })}
              onClick={() => this.props.router.push(`/categories?search=&category=${item.rawId}`)}
              onKeyDown={() => { }}
              role="button"
              tabIndex="0"
            >
              <span styleName="separator">/</span>{getNameText(item.name, 'EN')}
            </div>
          ))
        }
      </div>
    );
  }

  render() {
    const { volume, volume2 } = this.state;
    const priceRange = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'priceRange'], this.props);
    const attrFilters = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'attrFilters'], this.props);
    const accordionItems = this.generateTree();
    const products = pathOr(null, ['search', 'findProduct', 'edges'], this.props);
    const categoryId = pathOr(null, ['match', 'location', 'query', 'category'], this.props);
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
    return (
      <div styleName="container">
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <div>
              {accordionItems &&
                <Accordion
                  items={accordionItems}
                  onClick={this.handleOnChangeCategory}
                  activeId={categoryId ? parseInt(categoryId, 10) : null}
                />
              }
              <div styleName="blockTitle">Price (STQ)</div>
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
              {attrFilters && sort((a, b) => (a.attribute.rawId - b.attribute.rawId), attrFilters)
                .map(attrFilter => (
                  <div key={attrFilter.attribute.id} styleName="attrBlock">
                    <AttributeControl
                      attrFilter={attrFilter}
                      onChange={this.handleOnChangeAttribute(attrFilter)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div styleName="contentContainer">
            <div styleName="topContentContainer">
              {this.renderBreadcrumbs()}
            </div>
            <div styleName="productsContainer">
              {productsWithVariants && productsWithVariants.map(item => (
                <div key={item.id} styleName="cardWrapper">
                  <CardProduct item={item} />
                </div>
              ))}
              {this.props.relay.hasMore() && (
                <div styleName="button">
                  <Button
                    big
                    load
                    onClick={this.productsRefetch}
                  >
                    Load more
                  </Button>
                </div>
              )}
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
              parentId
              name {
                text
                lang
              }
              children {
                rawId
                level
                parentId
                name {
                  text
                  lang
                }
                children {
                  rawId
                  level
                  parentId
                  name {
                    text
                    lang
                  }
                  children {
                    rawId
                    level
                    parentId
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
