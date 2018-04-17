// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import type { Node } from 'react';
import classNames from 'classnames';
import { pathOr } from 'ramda';

import { CategoriesMenu } from 'components/CategoriesMenu';

import './Main.scss';

type PropsType = {
  children: Node,
  withoutCategories: ?boolean,
};

class Main extends PureComponent<PropsType> {
  render() {
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    const { withoutCategories } = this.props;
    return (
      <main styleName={classNames('container', { isCategories: categories })}>
        <div styleName="wrap">
          {categories && !withoutCategories && <CategoriesMenu categories={categories} />}
          { this.props.children }
        </div>
      </main>
    );
  }
}

Main.contextTypes = {
  directories: PropTypes.object,
};

export default Main;
