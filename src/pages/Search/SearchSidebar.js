// @flow

import React, { Component } from 'react';
import {
  find,
  sort,
  pathOr,
  whereEq,
  where,
  filter,
  any,
  equals,
  assocPath,
  complement,
} from 'ramda';
import { withRouter, routerShape } from 'found';

import { flattenFunc, urlToInput, inputToUrl, getNameText } from 'utils';

import { Accordion, prepareForAccordion } from 'components/Accordion';
import { RangerSlider } from 'components/Ranger';
import { AttributeControl } from 'components/AttributeControl';

import type { Categories_search as CategoriesSearch } from './__generated__/Categories_search.graphql';

import './SearchSidebar.scss';

type PropsType = {
  router: routerShape,
  /* eslint-disable react/no-unused-prop-types */
  search: CategoriesSearch,
};

type StateType = {
  volume: number,
  volume2: number,
};

type TranslateType = {
  text: string,
  lang: string,
};

type AttrFilterType = {
  id: string,
  name: Array<TranslateType>,
  metaField: ?{
    values: ?Array<string>,
    translatedValues: ?Array<TranslateType>,
    uiElement: string,
  },
};

class SearchSidebar extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(
    nextProps: PropsType,
    prevState: StateType,
  ): ?StateType {
    // maxValue of ranger from back (permanent for each category)
    // $FlowIgnoreMe
    const maxValue = pathOr(
      0,
      ['findProduct', 'pageInfo', 'searchFilters', 'priceRange', 'maxValue'],
      nextProps.search,
    );
    // maxValue of ranger from url
    // $FlowIgnoreMe
    const maxValueFromUrl = pathOr(
      0,
      ['match', 'location', 'query', 'maxValue'],
      nextProps,
    );
    const maxValueFromUrlInt = parseInt(maxValueFromUrl, 10);
    // get initial maxValue ranger from url if we can
    const volume2 =
      maxValueFromUrlInt && maxValueFromUrlInt < maxValue
        ? maxValueFromUrlInt
        : maxValue;
    return {
      ...prevState,
      volume: 0,
      volume2,
    };
  }

  state = {
    volume: 0,
    volume2: 0,
  };

  generateTree = () => {
    // generate categories tree for render categories filter
    // $FlowIgnoreMe
    const categoryId = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      this.props,
    );
    // $FlowIgnoreMe
    const categories = pathOr(
      null,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'categories',
        'children',
      ],
      this.props,
    );
    if (!categories) {
      return null;
    }
    // prepare array of all categories
    const flattenCategories = flattenFunc(categories);
    // function get level and return function for filtering
    // categories by level with no empty children
    const levelFilter = level =>
      filter(
        where({
          level: equals(level),
          children: i => i.length !== 0,
        }),
      );
    // check that we need to render category 1 level with children in sidebar
    const isFirstCatPred = whereEq({
      level: 1,
      rawId: parseInt(categoryId, 10),
    });
    const isFirstCategory = any(isFirstCatPred, flattenCategories);
    if (isFirstCategory) {
      const filtered = levelFilter(1)(flattenCategories);
      return prepareForAccordion(filtered);
    }
    const filtered = levelFilter(2)(flattenCategories);
    return prepareForAccordion(filtered);
  };
  handleOnChangeCategory = (item): void => {
    const { volume, volume2 } = this.state;
    // $FlowIgnoreMe
    const name = pathOr(
      '',
      ['match', 'location', 'query', 'search'],
      this.props,
    );
    this.props.router.push(
      `/categories?search=${name}&category=${
        item.id
      }&minValue=${volume}&maxValue=${volume2}`,
    );
  };
  handleOnRangeChange = (value: number, fieldName: string): void => {
    this.setState({
      [fieldName]: value,
    });
  };
  handleOnChangeCategory = item => {
    const { volume, volume2 } = this.state;
    // $FlowIgnoreMe
    const name = pathOr(
      '',
      ['match', 'location', 'query', 'search'],
      this.props,
    );
    this.props.router.push(
      `/categories?search=${name}&category=${
        item.id
      }&minValue=${volume}&maxValue=${volume2}`,
    );
  };
  handleOnRangeChange = (value: number, fieldName: string): void => {
    this.setState({
      [fieldName]: value,
    });
  };
  prepareAttrsToUrlStr = (id, values) => {
    // getting current searchInput data change attrs and push to new url
    // $FlowIgnoreMe
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);
    const oldAttrs = pathOr([], ['options', 'attrFilters'], oldPreparedObj);
    const newPreparedObj = assocPath(
      ['options', 'attrFilters'],
      [
        ...filter(complement(whereEq({ id })), oldAttrs),
        {
          id,
          equal: {
            values,
          },
        },
      ],
      oldPreparedObj,
    );
    return inputToUrl(newPreparedObj);
  };
  handleOnChangeAttribute = (attrFilter: AttrFilterType) => {
    // $FlowIgnoreMe
    const id = pathOr(null, ['attribute', 'id'], attrFilter);
    // $FlowIgnoreMe
    const rawId = pathOr(null, ['attribute', 'rawId'], attrFilter);
    return (value: string) => {
      const newUrl = this.prepareAttrsToUrlStr(rawId, value);
      this.props.router.push(`/categories${newUrl}`);
      if (id) {
        this.setState({
          [id]: value,
        });
      }
    };
  };
  handleOnCompleteRange = (value: number, value2: number): void => {
    // getting current searchInput data change range and push to new url
    // $FlowIgnoreMe
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);
    const newPreparedObj = assocPath(
      ['options', 'priceFilter'],
      {
        minValue: value,
        maxValue: value2,
      },
      oldPreparedObj,
    );
    const newUrl = inputToUrl(newPreparedObj);
    this.props.router.push(`/categories${newUrl}`);
  };
  renderParentLink = () => {
    // $FlowIgnoreMe
    const categoryId = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      this.props,
    );
    // $FlowIgnoreMe
    const categories = pathOr(
      null,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'categories',
        'children',
      ],
      this.props,
    );
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
    const findCatPred = rawId => find(whereEq({ rawId }));
    const catObj = findCatPred(parseInt(categoryId, 10))(arr);
    let parentObj = null;
    // подготовка объекта категории
    if (catObj) {
      switch (catObj.level) {
        case 3:
          // если категория 3 уровня надо отрисовать backlink на бабушку
          parentObj = findCatPred(catObj.parentId)(arr);
          parentObj = parentObj ? findCatPred(parentObj.parentId)(arr) : null;
          break;
        case 2:
          parentObj = find(whereEq({ rawId: catObj.parentId }), arr);
          break;
        default:
          break;
      }
    }
    if (!parentObj) return linkComponent();
    return linkComponent(parentObj);
  };
  render() {
    const { volume, volume2 } = this.state;
    // $FlowIgnoreMe
    const priceRange = pathOr(
      null,
      ['search', 'findProduct', 'pageInfo', 'searchFilters', 'priceRange'],
      this.props,
    );
    // $FlowIgnoreMe
    const attrFilters = pathOr(
      null,
      ['search', 'findProduct', 'pageInfo', 'searchFilters', 'attrFilters'],
      this.props,
    );
    const accordionItems = this.generateTree();
    // $FlowIgnoreMe
    const categoryId = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      this.props,
    );

    // for attrs initial
    // $FlowIgnoreMe
    const queryObj = pathOr(0, ['match', 'location', 'query'], this.props);
    const initialSearchInput = urlToInput(queryObj);
    const initialAttributes = pathOr(
      [],
      ['options', 'attrFilters'],
      initialSearchInput,
    );
    const maxValue = (priceRange && priceRange.maxValue) || 0;
    return (
      <div styleName="container">
        <div>
          {this.renderParentLink()}
          {accordionItems && (
            <Accordion
              items={accordionItems}
              onClick={this.handleOnChangeCategory}
              activeId={categoryId ? parseInt(categoryId, 10) : null}
            />
          )}
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
          {attrFilters &&
            sort(
              (a, b) => a.attribute.rawId - b.attribute.rawId,
              attrFilters,
            ).map(attrFilter => {
              const initialAttr = find(
                whereEq({ id: attrFilter.attribute.rawId }),
                // $FlowIgnoreMe
                initialAttributes,
              );
              const initialValues = pathOr(
                [],
                ['equal', 'values'],
                initialAttr,
              );
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
    );
  }
}

export default withRouter(SearchSidebar);
