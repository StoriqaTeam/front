// @flow strict

import React from 'react';
import classNames from 'classnames';

import { getNameText } from 'utils';

import type { CategoryType } from './CategorySelector';

import './CategorySelector.scss';

type PropsType = {
  items: ?Array<CategoryType>,
  lang: string,
  onClick: (e: CategoryType) => () => void,
  selectedItem: ?CategoryType,
};

const LevelList = ({ items, onClick, lang, selectedItem }: PropsType) => (
  <div>
    {items &&
      items.map(item => (
        <div key={item.rawId} styleName="itemWrap">
          <div
            onClick={onClick(item)}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
            styleName={classNames('item', {
              selectedItem: selectedItem === item,
            })}
            data-test={`categoryItem_${item.rawId || ''}`}
          >
            {getNameText(item.name, lang)}
          </div>
        </div>
      ))}
  </div>
);

export default LevelList;
