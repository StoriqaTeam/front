// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import log from 'utils/log';
import { Page } from 'components/App';
import { Accordion } from 'components/Accordion';
// import { BannersSlider } from 'components/BannersSlider';
// import { BannersRow } from 'components/BannersRow';
import { search, flattenFunc } from 'utils';

import CategoriesMenu from './CategoriesMenu';
import Sidebar from './Sidebar';

import './Search.scss';

// import tree from './tree.json';

class Search extends PureComponent<{}> {
  handleOnChangeCategory = item => log.info(item);

  render() {
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    const arr = flattenFunc(categories);
    const pathArr = search(arr, 10);
    console.log('^&^&^ pathArr: ', { pathArr });
    return (
      <div styleName="container">
        {categories && <CategoriesMenu categories={categories} />}
        <div styleName="wrapper">
          <div styleName="sidebarContainer">
            <Sidebar>
              {/* <Accordion tree={pathArr.length === 3 ? pathArr.splice(1) : []} activeRowId={10} /> */}
              <Accordion
                tree={tree}
                activeRowId={10}
                onClick={this.handleOnChangeCategory}
              />
            </Sidebar>
          </div>
          <div styleName="contentContainer">Content</div>
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

const tree = [
  {
    name: 'Обувь для бега',
    id: 1,
    children: [
      {
        name: 'Кросовки',
        id: 2,
      },
      {
        name: 'Кеды',
        id: 3,
      },
      {
        name: 'Сникерсы',
        id: 4,
      },
      {
        name: 'Sprinters',
        id: 5,
      },
      {
        name: 'Runners',
        id: 6,
      },
    ],
  },
  {
    name: 'Товары для спорта',
    id: 7,
    children: [
      {
        name: 'Бутсы',
        id: 8,
      },
      {
        name: 'Шмутсы',
        id: 9,
      },
      {
        name: 'Жмутся',
        id: 10,
      },
      {
        name: 'Рвутся',
        id: 11,
      },
    ],
  },
];