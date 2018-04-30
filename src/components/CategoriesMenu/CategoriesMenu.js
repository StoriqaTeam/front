// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { find, propEq } from 'ramda';
import { Link, withRouter } from 'found';

import { Icon } from 'components/Icon';

import './CategoriesMenu.scss';

type PropsType = {
  categories: Array<{
    rawId: string,
    name: Array<{
      lang: string,
      text: string,
    }>,
    children?: Array<any>,
  }>,
};

type StateType = {
  active: ?string,
  activeMid: ?string,
  activeMidGhost: ?string,
  pageX: number,
  rightMouseDirection: boolean,
};

class CategoriesMenu extends Component<PropsType, StateType> {
  state = {
    active: null,
    activeMid: null,
    activeMidGhost: null,
    pageX: 0,
    rightMouseDirection: false,
  };

  componentWillUnmount() {
    if (this.onMouseOverTimer) {
      clearTimeout(this.onMouseOverTimer);
    }
    if (this.onMouseOutTimer) {
      clearTimeout(this.onMouseOutTimer);
    }
    if (this.onMouseMoveTimer) {
      clearTimeout(this.onMouseMoveTimer);
    }
  }

  onMouseOverTimer: TimeoutID;
  onMouseOutTimer: TimeoutID;
  onMouseMoveTimer: TimeoutID;

  onMouseOver = e => {
    const { id } = e.currentTarget;
    const { active } = this.state;
    if (this.onMouseOutTimer) {
      clearTimeout(this.onMouseOutTimer);
    }
    if (this.onMouseOverTimer) {
      clearTimeout(this.onMouseOverTimer);
    }
    if (active !== id) {
      this.onMouseOverTimer = setTimeout(() => {
        this.setState(() => ({ active: id }));
      }, 300);
    }
  };

  onMouseOut = () => {
    const { active } = this.state;
    if (this.onMouseOutTimer) {
      clearTimeout(this.onMouseOutTimer);
    }
    if (this.onMouseOverTimer) {
      clearTimeout(this.onMouseOverTimer);
    }
    if (active) {
      this.onMouseOutTimer = setTimeout(() => {
        this.setState(() => ({ active: null }));
      }, 150);
    }
  };

  onMouseOverMid = e => {
    const { id } = e.currentTarget;
    const { rightMouseDirection } = this.state;
    if (rightMouseDirection) {
      this.setState(() => ({ activeMidGhost: id }));
      return;
    }
    this.setState(() => ({ activeMid: id }));
  };

  onMouseOutMid = () => {
    this.setState(() => ({ activeMidGhost: null }));
  };

  onMouseMove = e => {
    const { pageX } = e;
    const { activeMidGhost } = this.state;

    if (pageX < this.state.pageX) {
      this.setState(() => ({ rightMouseDirection: false }));
    }
    if (pageX > this.state.pageX) {
      this.setState(() => ({ rightMouseDirection: true }));
    }

    if (this.onMouseMoveTimer) {
      clearTimeout(this.onMouseMoveTimer);
    }
    this.onMouseMoveTimer = setTimeout(() => {
      this.setState(() => ({
        rightMouseDirection: false,
        activeMid: activeMidGhost || this.state.activeMid,
      }));
    }, 50);

    this.setState(() => ({ pageX }));
  };

  renderMenu(categories: any, isRoot: ?boolean) {
    const { active, activeMid } = this.state;
    const lang = 'EN';
    return categories.map(category => {
      const { rawId } = category;
      const categoryChildren = category.children;
      const name = find(propEq('lang', lang))(category.name);
      const renderInnerLink = () => (
        <Fragment>
          <span styleName="text">{name.text}</span>
          {categoryChildren &&
            !isRoot && (
              <span styleName="icon">
                <Icon type="arrowRight" />
              </span>
            )}
        </Fragment>
      );
      return (
        <li
          id={category.rawId}
          key={category.rawId}
          styleName={classNames({
            rootItem: isRoot,
            midItem: !isRoot && categoryChildren,
            activeItem: isRoot && active === `${category.rawId}`,
            activeItemMod: !isRoot && activeMid === `${category.rawId}`,
          })}
          onMouseOver={isRoot ? this.onMouseOver : this.onMouseOverMid}
          onMouseOut={isRoot ? this.onMouseOut : this.onMouseOutMid}
          onBlur={() => {}}
          onFocus={() => {}}
        >
          <Link
            styleName="link"
            to={{
              pathname: '/categories',
              query: {
                search: '',
                category: rawId,
              },
            }}
            data-test="categorieLink"
          >
            {renderInnerLink()}
          </Link>
          {categoryChildren && (
            <div styleName="items" onMouseMove={this.onMouseMove}>
              <div styleName="itemsWrap">
                <div styleName="title">{name.text}</div>
                <ul>{this.renderMenu(categoryChildren)}</ul>
              </div>
            </div>
          )}
        </li>
      );
    });
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="rootItem rootButtonItem">
          <Link styleName="button" to="/" data-test="allCategoriesLink">
            <Icon inline type="cats" size="24" />
            <span styleName="buttonText">All</span>
          </Link>
        </div>
        <ul styleName="root">{this.renderMenu(this.props.categories, true)}</ul>
      </div>
    );
  }
}

export default withRouter(CategoriesMenu);
