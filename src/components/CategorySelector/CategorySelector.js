// @flow

import React from 'react';
import classNames from 'classnames';

import LevelList from './LevelList';
import { getNameText } from './utils';

import './CategorySelector.scss';

type NameType = {
  lang: string,
  text: string,
}

type CategoryType = {
  children?: Array<CategoryType>,
  name: Array<NameType>,
  rawId?: string,
}

type PropsType = {
  categories: CategoryType,
  onSelect: (categoryId: number) => void,
}

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
  }
}

class CategorySelector extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      lang: 'EN',
      isShow: false,
      level1Item: null,
      level2Item: null,
      level3Item: null,
      snapshot: null,
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
    const isCategoryWrap = this.categoryWrapp && this.categoryWrapp.contains(e.target);
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
  }

  renderPath = () => {
    const {
      lang,
      snapshot,
    } = this.state;
    return (
      <div
        styleName="breadcrumbs"
        onClick={() => this.setState({ isShow: true })}
        onKeyDown={() => { }}
        role="button"
        tabIndex="0"
      >
        {snapshot && [snapshot.level1Item, snapshot.level2Item, snapshot.level3Item].map((item, index) => (item ? <span key={item.rawId}>{index !== 0 && ' / '}{getNameText(item.name, lang)}</span> : null))}
        {!snapshot && 'Выбрать категорию'}
      </div>
    );
  }

  render() {
    const {
      lang,
      level1Item,
      level2Item,
      level3Item,
      isShow,
    } = this.state;
    const { categories } = this.props;
    return (
      <div styleName="wrapper">
        <p styleName="label">Category</p>
        <div
          styleName="breadcrumbsWrapper"
          ref={(node) => { this.button = node; }}
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
            ref={(node) => { this.categoryWrapp = node; }}
          >
            <div styleName="label">Категории</div>
            <div styleName="levelWrapper">
              <div styleName="level">
                <LevelList
                  items={categories.children}
                  lang={lang}
                  onClick={this.handleOnChoose}
                  selectedItem={level1Item}
                />
              </div>
              <div styleName="level">
                {level1Item &&
                  <LevelList
                    items={level1Item.children}
                    lang={lang}
                    onClick={this.handleOnChoose}
                    selectedItem={level2Item}
                  />
                }
              </div>
              <div styleName="level">
                {level2Item &&
                  <LevelList
                    items={level2Item.children}
                    lang={lang}
                    onClick={this.handleOnChoose}
                    selectedItem={level3Item}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategorySelector;
