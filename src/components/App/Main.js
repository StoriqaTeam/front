// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import type { Node } from 'react';
import { pathOr } from 'ramda';
import { CategoriesMenu } from 'components/CategoriesMenu';

import './Main.scss';

type PropsType = {
  children: Node,
};

class Main extends PureComponent<PropsType> {
  render() {
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    return (
      <main styleName="container">
        <div styleName="wrap">
          {categories && <CategoriesMenu categories={categories} />}
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
