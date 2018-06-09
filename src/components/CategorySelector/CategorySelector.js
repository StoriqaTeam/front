// @flow

import React, { Fragment } from 'react';
import classNames from 'classnames';
import { zipObj, isEmpty } from 'ramda';

import { getNameText, searchPathByParent, flattenFunc } from 'utils';

import LevelList from './LevelList';

import './CategorySelector.scss';

type NameType = {
  lang: string,
  text: string,
};

type CategoryType = {
  children?: Array<CategoryType>,
  name: Array<NameType>,
  rawId?: string,
};

type PropsType = {
  categories: CategoryType,
  onSelect: (categoryId: number) => void,
  category: {
    rawId: number,
  },
};

type StateType = {
  lang: string,
  isShow: boolean,
  level1Item: ?CategoryType,
  level2Item: ?CategoryType,
  level3Item: ?CategoryType,
  snapshot: ?{
    level1Item: ?CategoryType,
    level2Item: ?CategoryType,
    level3Item: ?CategoryType,
  },
};

class CategorySelector extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { categories, category } = props;
    let items = {
      level1Item: null,
      level2Item: null,
      level3Item: null,
    };
    if (categories && category) {
      const flattenCategories = flattenFunc(categories.children);
      const currentCategories = searchPathByParent(
        flattenCategories,
        category.rawId,
      );

      items = zipObj(
        ['level1Item', 'level2Item', 'level3Item'],
        currentCategories,
      );
    }

    this.state = {
      level1Item: null,
      level2Item: null,
      level3Item: null,
      snapshot: {
        ...items,
      },
      lang: 'EN',
      isShow: false,
    };
  }

  componentWillMount() {
    if (process.env.BROWSER) {
      window.addEventListener('click', this.handleToggleExpand);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('click', this.handleToggleExpand);
    }
  }

  categoryWrapp: any;
  items: any;
  button: any;

  handleToggleExpand = (e: any) => {
    const { snapshot } = this.state;
    const isCategoryWrap =
      this.categoryWrapp && this.categoryWrapp.contains(e.target);
    const isButton = this.button && this.button.contains(e.target);
    if (isButton && !isCategoryWrap) {
      this.setState({
        isShow: true,
        ...snapshot,
      });
      return;
    }
    if (!isCategoryWrap) {
      this.setState({
        isShow: false,
      });
    }
  };

  handleOnChoose = (category: any) => () => {
    const { onSelect } = this.props;
    this.setState({
      [`level${category.level}Item`]: category,
    });
    switch (category.level) {
      case 1:
        this.setState({
          level2Item: null,
          level3Item: null,
        });
        break;
      case 2:
        this.setState({
          level3Item: null,
        });
        break;
      case 3:
        this.setState({
          isShow: false,
          snapshot: {
            level1Item: this.state.level1Item,
            level2Item: this.state.level2Item,
            level3Item: category,
          },
        });
        onSelect(parseInt(category.rawId, 10));
        break;
      default:
        break;
    }
  };

  renderPath = () => {
    const { lang, snapshot } = this.state;
    return (
      <div
        styleName="breadcrumbs"
        onClick={() => this.setState({ isShow: true })}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        {snapshot &&
          [snapshot.level1Item, snapshot.level2Item, snapshot.level3Item].map(
            (item, index) =>
              item ? (
                <span key={item.rawId}>
                  {index !== 0 && ' / '}
                  {getNameText(item.name, lang)}
                </span>
              ) : null,
          )}
        {!isEmpty(snapshot) && 'Choose category'}
      </div>
    );
  };

  render() {
    const { categories } = this.props;
    const { lang, level1Item, level2Item, level3Item, isShow } = this.state;

    const level1ItemName = level1Item ? getNameText(level1Item.name, lang) : '';
    const level2ItemName = level2Item ? getNameText(level2Item.name, lang) : '';

    return (
      <div styleName="wrapper">
        <div styleName="label">Category</div>
        <div
          styleName="breadcrumbsWrapper"
          ref={node => {
            this.button = node;
          }}
        >
          {this.renderPath()}
        </div>
        <div
          styleName={classNames('items', {
            hidden: !isShow,
          })}
        >
          <div
            styleName="menuContainer"
            ref={node => {
              this.categoryWrapp = node;
            }}
          >
            <div styleName="levelWrapper">
              <div styleName="level">
                <Fragment>
                  <div styleName="levelLabel">Categories</div>
                  <LevelList
                    items={categories.children}
                    lang={lang}
                    onClick={this.handleOnChoose}
                    selectedItem={level1Item}
                  />
                </Fragment>
              </div>
              <div styleName="level">
                {level1Item && (
                  <Fragment>
                    <div styleName="levelLabel">{level1ItemName}</div>
                    <LevelList
                      items={level1Item.children}
                      lang={lang}
                      onClick={this.handleOnChoose}
                      selectedItem={level2Item}
                    />
                  </Fragment>
                )}
              </div>
              <div styleName="level">
                {level2Item && (
                  <Fragment>
                    <div styleName="levelLabel">{level2ItemName}</div>
                    <LevelList
                      items={level2Item.children}
                      lang={lang}
                      onClick={this.handleOnChoose}
                      selectedItem={level3Item}
                    />
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategorySelector;
