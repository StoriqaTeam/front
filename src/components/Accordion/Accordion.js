// @flow

import React from 'react';

import AccordionBlock from './AccordionBlock';

import './Accordion.scss';

type TreeType = {
  name: string,
  id: number,
  children?: Array<TreeType>,
}

type PropsType = {
  tree: Array<TreeType>,
  activeRowId: number,
  onClick: (item: TreeType) => void,
}

const Accordion = ({ activeRowId, onClick, tree }: PropsType) => (
  <div styleName="wrapper">
    {/* {(tree[1] && tree[1].name) && getNameText(tree[1].name, 'EN')} */}
    {tree.map((item, index) => (
      <div key={item.id} styleName="block">
        <AccordionBlock
          tree={item}
          isExpanded={index < 3}
          active={activeRowId}
          onClick={onClick}
        />
      </div>
    ))}
  </div>
);


export default Accordion;
