// @flow

import React, { Component, Fragment } from 'react';
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
import classNames from 'classnames';

import {
  flattenFunc,
  urlToInput,
  inputToUrl,
  getNameText,
  getCurrentCurrency,
} from 'utils';
import debounce from 'lodash.debounce';

import { Accordion, prepareForAccordion } from 'components/Accordion';
import { RangeSlider } from 'components/Ranger';
import { AttributeControl } from 'components/AttributeControl';
import { Icon } from 'components/Icon';

import type { Categories_search as CategoriesSearch } from '../Categories/__generated__/Categories_search.graphql';

import './SearchSidebar.scss';

import t from './i18n';

type PropsType = {
  router: routerShape,
  /* eslint-disable react/no-unused-prop-types */
  search: CategoriesSearch,
  onClose: () => void,
  isOpen: boolean,
};

type StateType = {
  thumb1: number,
  thumb2: number,
  minValue: number,
  maxValue: number,
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
  constructor(props) {
    super(props);

    const minValue = pathOr(
      0,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'priceRange',
        'minValue',
      ],
      props,
    );

    const maxValue = pathOr(
      0,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'priceRange',
        'maxValue',
      ],
      props,
    );

    let thumb1 = pathOr(
      null,
      ['match', 'location', 'query', 'minValue'],
      props,
    );

    let thumb2 = pathOr(
      null,
      ['match', 'location', 'query', 'maxValue'],
      props,
    );

    thumb1 = Number(thumb1 || minValue);
    thumb2 = Number(thumb2 || maxValue);

    if (thumb1 < minValue) {
      thumb1 = minValue;
    }
    if (thumb1 > maxValue) {
      thumb1 = maxValue;
    }
    if (thumb2 < minValue) {
      thumb2 = minValue;
    }
    if (thumb2 > maxValue) {
      thumb2 = maxValue;
    }
    if (thumb2 < thumb1) {
      thumb2 = thumb1;
    }

    this.state = {
      thumb1,
      thumb2,
      minValue,
      maxValue,
    };
    this.setRangeUrl = debounce(this.setRangeUrl, 500);
    this.setRangeUrl(thumb1, thumb2, 'replace');
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    // $FlowIgnore
    const minValue = pathOr(
      0,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'priceRange',
        'minValue',
      ],
      this.props,
    );

    // $FlowIgnore
    const maxValue = pathOr(
      0,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'priceRange',
        'maxValue',
      ],
      this.props,
    );
    // console.log('minValue', minValue);
    // console.log('maxValue', maxValue);

    if (minValue !== prevState.minValue || maxValue !== prevState.maxValue) {
      this.setRangeData(minValue, maxValue);
    }
  }

  setRangeData = (minValue: number, maxValue: number): void => {
    this.setState(
      {
        thumb1: minValue,
        thumb2: maxValue,
        minValue,
        maxValue,
      },
      (): void => {
        this.setRangeUrl(minValue, maxValue, 'replace');
      },
    );
  };

  setRangeUrl = (thumb1: number, thumb2: number, type?: string) => {
    // $FlowIgnore
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);
    const newPreparedObj = assocPath(
      ['options', 'priceFilter'],
      {
        minValue: thumb1,
        maxValue: thumb2,
      },
      oldPreparedObj,
    );
    const newUrl = inputToUrl(newPreparedObj);
    if (oldPreparedObj !== newPreparedObj) {
      if (type === 'replace') {
        if (process.env.BROWSER) {
          this.props.router.replace(`/categories${newUrl}`);
        }
        return;
      }

      if (process.env.BROWSER) {
        this.props.router.push(`/categories${newUrl}`);
      }
    }
  };

  getSearchFilter = (filterProp: string) => {
    const searchFiltersPath = [
      'search',
      'findProduct',
      'pageInfo',
      'searchFilters',
    ];
    // $FlowIgnoreMe
    return pathOr(null, [...searchFiltersPath, filterProp], this.props);
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
          children: i => i && i.length !== 0,
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
      return prepareForAccordion(filtered, 'EN');
    }
    const filtered = levelFilter(2)(flattenCategories);
    return prepareForAccordion(filtered, 'EN');
  };

  handleOnChangeCategory = (item): void => {
    const { router } = this.props;
    // $FlowIgnore
    const name = pathOr(
      '',
      ['match', 'location', 'query', 'search'],
      this.props,
    );
    router.push(`/categories?search=${name}&category=${item.id}`);
  };

  handleOnRangeChange = (data: { thumb1: number, thumb2: number }) => {
    this.setRangeUrl(data.thumb1, data.thumb2, 'replace');
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

  handleOnChangeAttribute = (
    attrFilter: AttrFilterType,
  ): ((value: string) => void) => {
    const { router } = this.props;
    const attributePath = ['attribute'];
    // $FlowIgnoreMe
    const id = pathOr(null, [...attributePath, 'id'], attrFilter);
    // $FlowIgnoreMe
    const rawId = pathOr(null, [...attributePath, 'rawId'], attrFilter);
    return (value: string): void => {
      const newUrl = this.prepareAttrsToUrlStr(rawId, value);
      router.push(`/categories${newUrl}`);
      if (id) {
        this.setState({
          [id]: value,
        });
      }
    };
  };

  renderParentLink = () => {
    const { router } = this.props;
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
            router.push('/categories?search=');
          } else {
            router.push(`/categories?search=&category=${obj.rawId}`);
          }
        }}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        {obj && getNameText(obj.name, 'EN')}
        {!obj && t.allCategories}
      </div>
    );
    if (!categoryId) return linkComponent();
    const arr = flattenFunc(categories);
    const findCatPred = rawId => find(whereEq({ rawId }));
    const catObj = findCatPred(parseInt(categoryId, 10))(arr);
    let parentObj = null;
    if (catObj) {
      switch (catObj.level) {
        case 3:
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
    const { onClose, isOpen } = this.props;
    const { thumb1, thumb2, minValue, maxValue } = this.state;
    const attrFilters = this.getSearchFilter('attrFilters');
    const accordionItems = this.generateTree();
    // $FlowIgnoreMe
    const categoryId = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      this.props,
    );

    // $FlowIgnoreMe
    const queryObj = pathOr(0, ['match', 'location', 'query'], this.props);
    const initialSearchInput = urlToInput(queryObj);
    const initialAttributes = pathOr(
      [],
      ['options', 'attrFilters'],
      initialSearchInput,
    );
    return (
      <aside
        styleName={classNames('container', {
          toggledSidebar: isOpen,
        })}
      >
        <header styleName="header">
          <h3>{t.filters}</h3>
          <span
            id="close"
            onClick={onClose}
            onKeyPress={() => {}}
            role="button"
            tabIndex="-1"
          >
            <Icon type="cross" size={24} />
          </span>
        </header>
        {this.renderParentLink()}
        {accordionItems && (
          <Accordion
            items={accordionItems}
            onClick={this.handleOnChangeCategory}
            activeId={categoryId ? parseInt(categoryId, 10) : null}
          />
        )}
        {parseFloat(minValue) !== parseFloat(maxValue) && (
          <Fragment>
            <div styleName="blockTitle">{`Price (${getCurrentCurrency(
              'FIAT',
            )})`}</div>
            <RangeSlider
              thumb1={thumb1}
              thumb2={thumb2}
              minValue={minValue}
              maxValue={maxValue}
              onChange={(data: { thumb1: number, thumb2: number }) => {
                this.setRangeUrl(data.thumb1, data.thumb2, 'replace');
              }}
            />
          </Fragment>
        )}
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
      </aside>
    );
  }
}

export default withRouter(SearchSidebar);
