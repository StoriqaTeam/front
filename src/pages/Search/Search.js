// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, filter, where, equals } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import log from 'utils/log';
import { Page } from 'components/App';
import { Accordion, prepareForAccordion } from 'components/Accordion';
import { Ranger } from 'components/Ranger';
import { searchPathByParent, flattenFunc, getNameText } from 'utils';

import CategoriesMenu from './CategoriesMenu';
import Sidebar from './Sidebar';

import './Search.scss';

type PropsType = {
  categoryRowId: number,
}

class Search extends PureComponent<PropsType> {
  generateTree = () => {
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    const level2Filter = filter(where({ level: equals(2), children: i => i.length !== 0 }));
    const res = level2Filter(flattenFunc(categories));
    return prepareForAccordion(res);
  }

  handleOnChangeCategory = item => log.info(item);

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
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    return (
      <div styleName="container">
        {categories && <CategoriesMenu categories={categories} />}
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <Sidebar>
              <Accordion
                tree={this.generateTree()}
                activeRowId={10}
                onClick={this.handleOnChangeCategory}
              />
              <Ranger />
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
