// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { find, any, sort, pathOr, filter, where, equals, map, evolve, pipe, path, assoc, assocPath, whereEq, complement } from 'ramda';
import { createPaginationContainer, graphql, Relay } from 'react-relay';
import { withRouter, routerShape } from 'found';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { flattenFunc, urlToInput, inputToUrl, getNameText, searchPathByParent, log } from 'utils';
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
    const maxValue = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'priceRange', 'maxValue'], props);
    const maxValueFromUrl = pathOr(0, ['match', 'location', 'query', 'maxValue'], this.props);
    const maxValueFromUrlInt = parseInt(maxValueFromUrl, 10);
    const volume2 = maxValueFromUrlInt && maxValueFromUrlInt < maxValue ?
      maxValueFromUrlInt
      : maxValue;
    this.state = {
      volume: 0,
      volume2,
    };
  }

  generateTree = () => {
    const categoryId = pathOr(null, ['match', 'location', 'query', 'category'], this.props);
    const categories = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    if (!categories) return null;
    const flattenCategories = flattenFunc(categories);
    const levelFilter = level => filter(where({
      level: equals(level),
      children: i => i.length !== 0,
    }));
    const isFirstCatPred = whereEq({ level: 1, rawId: parseInt(categoryId, 10) });
    const isFirstCategory = any(isFirstCatPred, flattenCategories);
    if (isFirstCategory) {
      const filtered = levelFilter(1)(flattenCategories);
      return prepareForAccordion(filtered);
    }
    const filtered = levelFilter(2)(flattenCategories);
    return prepareForAccordion(filtered);
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
    const categoryId = pathOr(null, ['match', 'location', 'query', 'category'], this.props);
    const categories = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    if (!categories || !categoryId) {
      return null;
    }
    const arr = flattenFunc(categories);
    const pathArr = searchPathByParent(arr, parseInt(categoryId, 10));
    return (
      <div styleName="breadcrumbs">
        <div
          styleName="item"
          onClick={() => this.props.router.push('/categories?search=')}
          onKeyDown={() => {}}
          role="button"
          tabIndex="0"
        >
          All categories
        </div>
        {pathArr.length !== 0 &&
          pathArr.map(item => (
            <div
              key={item.rawId}
              styleName={classNames('item', { active: item.rawId === parseInt(categoryId, 10) })}
              onClick={() => this.props.router.push(`/categories?search=&category=${item.rawId}`)}
              onKeyDown={() => {}}
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

  renderParentLink = () => {
    const categoryId = pathOr(null, ['match', 'location', 'query', 'category'], this.props);
    const categories = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    const linkComponent = obj => (
      <div
        styleName="parentCategory"
        onClick={() => {
          if (!obj) {
            this.props.router.push('/categories?search=');
          } else {
            this.props.router.push(`/categories?search=&category=${obj.rawId}`);
          }
        }}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        {obj && getNameText(obj.name, 'EN')}
        {!obj && 'All categories'}
      </div>
    );
    if (!categoryId) return linkComponent();
    const arr = flattenFunc(categories);
    const catObj = find(whereEq({ rawId: parseInt(categoryId, 10) }), arr);
    const parentObj = catObj ? find(whereEq({ rawId: catObj.parentId }), arr) : null;
    if (!parentObj) return linkComponent();
    return linkComponent(parentObj);
  }

  render() {
    const { volume, volume2 } = this.state;
    const priceRange = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'priceRange'], this.props);
    const attrFilters = pathOr(null, ['search', 'findProduct', 'pageInfo', 'searchFilters', 'attrFilters'], this.props);
    const accordionItems = this.generateTree();
    const products = pathOr([], ['search', 'findProduct', 'edges'], this.props);
    const categoryId = pathOr(null, ['match', 'location', 'query', 'category'], this.props);

    // for attrs initial
    const queryObj = pathOr(0, ['match', 'location', 'query'], this.props);
    const initialSearchInput = urlToInput(queryObj);
    const initialAttributes = pathOr([], ['options', 'attrFilters'], initialSearchInput);
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
    const maxValue = (priceRange && priceRange.maxValue) || 0;
    return (
      <div styleName="container">
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <div>
              {this.renderParentLink()}
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
                max={maxValue}
                step={0.01}
                value={volume > maxValue ? 0 : volume}
                value2={volume2 > maxValue ? maxValue : volume2}
                onChange={value => this.handleOnRangeChange(value, 'volume')}
                onChange2={value => this.handleOnRangeChange(value, 'volume2')}
                onChangeComplete={this.handleOnCompleteRange}
              />
              {attrFilters && sort((a, b) => (a.attribute.rawId - b.attribute.rawId), attrFilters)
                .map((attrFilter) => {
                  const initialAttr = find(
                    whereEq({ id: attrFilter.attribute.rawId }),
                    initialAttributes,
                  );
                  const initialValues = pathOr([], ['equal', 'values'], initialAttr);
                  return (
                    <div key={attrFilter.attribute.id} styleName="attrBlock">
                      <AttributeControl
                        attrFilter={attrFilter}
                        initialValues={initialValues}
                        onChange={this.handleOnChangeAttribute(attrFilter)}
                      />
                    </div>
                  );
                })}
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
};

export default createPaginationContainer(
  withErrorBoundary(withRouter(Page(Categories))),
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
