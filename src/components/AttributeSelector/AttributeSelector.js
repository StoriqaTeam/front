// @flow

import React from 'react';

import AttributeControll from './AttributeControll';

import './AttributeSelector.scss';

type TranslateType = {
  text: string,
  lang: string
}

type AttributeType = {
  rawId: number,
  name: Array<TranslateType>,
  metaField: ?{
    values: ?Array<string>,
    translatedValues: ?Array<TranslateType>,
    uiElement: string,
  }
}

type PropsType = {
  attrFilters: AttributeType,
}

class AttributeSelector extends React.Component<PropsType> {
  render() {
    const { attrFilters } = this.props;
    return (
      <div>
        {attrFilters && attrFilters.map(filter => <AttributeControll key={filter.attribute.id} attrFilter={filter} />)}
      </div>
    );
  }
}

export default AttributeSelector;
