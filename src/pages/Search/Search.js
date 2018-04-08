// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, filter, where, equals } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import log from 'utils/log';
import { Page } from 'components/App';
import { Accordion, prepareForAccordion } from 'components/Accordion';
import { RangerSlider } from 'components/Ranger';
import { AttributeControll } from 'components/AttributeControll';
import { searchPathByParent, flattenFunc, getNameText } from 'utils';

import CategoriesMenu from './CategoriesMenu';
import Sidebar from './Sidebar';
import data from './data.json';

import './Search.scss';

type PropsType = {
  categoryRowId: number,
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

class Search extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      volume: 0.000000,
      volume2: 0.300505,
    };
  }

  generateTree = () => {
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
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
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    const arr = flattenFunc(categories);
    const pathArr = searchPathByParent(arr, categoryRowId);
    return (
      <div styleName="breadcrumbs">
        {pathArr.length !== 0 &&
          pathArr.map((item, index) => (
            <p key={item.rawId} styleName="item">
              {index > 0 && ' / '}{getNameText(item.name, 'EN')}
            </p>
          ))
        }
      </div>
    );
  }

  render() {
    const { volume, volume2 } = this.state;
    const { categoryRowId } = this.props;
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    const attrFilters = pathOr(null, ['data', 'search', 'findProduct', 'searchFilters', 'attrFilters'], data);
    return (
      <div styleName="container">
        {categories && <CategoriesMenu categories={categories} />}
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <Sidebar>
              <Accordion
                tree={this.generateTree()}
                activeRowId={categoryRowId}
                onClick={this.handleOnChangeCategory}
              />
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
              {/* <AttributeSelector attrFilters={this.getAttributes()} /> */}
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
            {this.renderBreadcrumbs()}
          </div>
        </div>
      </div>
    );
  }
}

Search.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default Page(Search);
