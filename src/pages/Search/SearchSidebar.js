import React, { Component } from 'react';
import { find, pathOr, whereEq } from 'ramda';

import { Accordion, prepareForAccordion } from 'components/Accordion';
import { RangerSlider } from 'components/Ranger';
import { AttributeControl } from 'components/AttributeControl';

import './SearchSidebar.scss';

class SearchSidebar extends Component {
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
    return (
      <div styleName="sidebarContainer">
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


export default SearchSidebar;
