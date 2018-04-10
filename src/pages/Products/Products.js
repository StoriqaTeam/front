// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, filter, where, equals } from 'ramda';
import { createPaginationContainer, graphql, Relay } from 'react-relay';

import { currentUserShape } from 'utils/shapes';
import log from 'utils/log';
import { Page } from 'components/App';
import { Accordion, prepareForAccordion } from 'components/Accordion';
import { MiniSelect } from 'components/MiniSelect';
import { RangerSlider } from 'components/Ranger';
import { CardProduct } from 'components/CardProduct';
import { AttributeControll } from 'components/AttributeControll';
import { searchPathByParent, flattenFunc, getNameText } from 'utils';

import CategoriesMenu from './CategoriesMenu';
import Sidebar from './Sidebar';
import data from './data.json';
import categoriesMock from './categories.json';

import './Products.scss';

type PropsType = {
  categoryRowId: number,
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

const storesPerRequest = 20;

class Products extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      volume: 0.000000,
      volume2: 0.300505,
    };
  }

  generateTree = () => {
    const categories = pathOr(null, ['search', 'findProductWithoutCategory', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    if (!categories) return null;
    const level2Filter = filter(where({ level: equals(2), children: i => i.length !== 0 }));
    const res = level2Filter(flattenFunc(categories));
    return prepareForAccordion(res);
  }

  handleOnChangeCategory = item => log.info(item);

  handleOnRangeChange = (value: number, fieldName: string) => {
    this.setState({
      [fieldName]: value,
    });
  }

  handleOnCompleteRange = (value: number, value2: number, e: Event) => {
    log.info({ value, value2 }, e);
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

  renderBreadcrumbs = () => {
    const { categoryRowId } = this.props;
    // const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    // const categories = pathOr(null, ['data', 'categories', 'children'], categoriesMock);
    const categories = pathOr(null, ['search', 'findProductWithoutCategory', 'pageInfo', 'searchFilters', 'categories', 'children'], this.props);
    if (!categories) {
      return (
        <div styleName="breadcrumbs">
          <p styleName="item">path not found</p>
        </div>
      );
    }
    const arr = flattenFunc(categories);
    const pathArr = searchPathByParent(arr, categoryRowId);
    return (
      <div styleName="breadcrumbs">
        <p styleName="item">Все категрии</p>
        {pathArr.length !== 0 &&
          pathArr.map(item => (
            <p key={item.rawId} styleName="item">
              <span styleName="separator">/</span>{getNameText(item.name, 'EN')}
            </p>
          ))
        }
      </div>
    );
  }

  renderSorting = () => {
    return (
      <div styleName="sortingContainer">
        <div>Сортировать по:</div>
        <MiniSelect
          forForm
          items={[
            {
              id: 'byPriceDecrease',
              label: 'Цена(уменьшение)',
            },
            {
              id: 'byPriceIncrease',
              label: 'Цена(увеличение)',
            },
          ]}
          onSelect={console.log}
          activeItem={{
            id: 'byPriceDecrease',
            label: 'Цена(уменьшение)',
          }}
          containerStyle={{
            width: '100%',
          }}
        />
      </div>
    );
  }

  render() {
    const { volume, volume2 } = this.state;
    const { categoryRowId } = this.props;
    const categories = pathOr(null, ['data', 'categories', 'children'], categoriesMock);
    const attrFilters = pathOr(null, ['data', 'search', 'findProduct', 'searchFilters', 'attrFilters'], data);
    const catTree = this.generateTree();
    const products = pathOr(null, ['search', 'findProductWithoutCategory', 'edges'], this.props);
    console.log('**** products: ', products[0].node);
    return (
      <div styleName="container">
        {/* {categories && <CategoriesMenu categories={categories} />} */}
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <Sidebar>
              {catTree &&
                <Accordion
                  tree={catTree}
                  activeRowId={categoryRowId}
                  onClick={this.handleOnChangeCategory}
                />
              }
              <div styleName="blockTitle">Цена (STQ)</div>
              <RangerSlider
                min={0}
                max={1}
                step={0.000001}
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
            <div styleName="topContentContainer">
              {this.renderBreadcrumbs()}
              {this.renderSorting()}
            </div>
            <div styleName="productsContainer">
              {products && products.map(item => (
                <p>product</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Products.contextTypes = {
  // environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default createPaginationContainer(
  Page(Products),
  graphql`
    fragment Products_search on Search
    @argumentDefinitions(
      text: { type: "SearchProductWithoutCategoryInput!" }
      first: { type: "Int", defaultValue: 20 }
      after: { type: "ID", defaultValue: null }
    ) {
      findProductWithoutCategory(searchTerm: $text, first: $first, after: $after) @connection(key: "Products_findProductWithoutCategory") {
        edges {
          cursor
          node {
            id
            rawId
          }
        }
        pageInfo {
          searchFilters {
            priceRange {
              minValue
              maxValue
            }
            categories {
              id
              rawId
              parentId
              level
              name {
                text
                lang
              }
              children {
                id
                rawId
                parentId
                level
                name {
                  text
                  lang
                }
                children {
                  id
                  rawId
                  parentId
                  level
                  name {
                    text
                    lang
                  }
                  children {
                    id
                    rawId
                    parentId
                    level
                    name {
                      text
                      lang
                    }
                  }
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
    getConnectionFromProps: props => props.search && props.search.findProductWithoutCategory,
    getVariables: (props, { count }, prevFragmentVars) => ({
      text: prevFragmentVars.text,
      after: props.search.findProductWithoutCategory.pageInfo.endCursor,
      first: count + storesPerRequest,
    }),
    query: graphql`
      query Products_edges_Query($first: Int, $after: ID, $text: SearchProductWithoutCategoryInput!) {
        search {
          ...Products_search @arguments(first: $first, after: $after, text: $text)
        }
      }
    `,
  },
);
