// @flow

import React from 'react';
import classNames from 'classnames';

import { getNameText } from 'utils';

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

type LevelListType = {
  items: ?Array<CategoryType>,
  lang: string,
  onClick: (e: any) => () => void,
  selectedItem: ?CategoryType,
};

const LevelList = ({ items, onClick, lang, selectedItem }: LevelListType) => (
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
