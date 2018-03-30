// @flow

import React from 'react';

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
    };
  }

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
      level1Item,
      level2Item,
      level3Item,
    } = this.state;
    return (
      <div
        styleName="breadcrumbs"
        onClick={() => this.setState({ isShow: true })}
        onKeyDown={() => { }}
        role="button"
        tabIndex="0"
      >
        {level1Item && [level1Item, level2Item, level3Item].map((item, index) => (item ? <span key={item.rawId}>{index !== 0 && ' / '}{getNameText(item.name, lang)}</span> : null))}
        {!level1Item && 'Выбрать категорию'}
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
        {this.renderPath()}
        {isShow &&
          <div styleName="menuContainer">
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
        }
      </div>
    );
  }
}

export default CategorySelector;
