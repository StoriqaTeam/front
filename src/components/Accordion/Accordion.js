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
    {tree.map((item, index) => (
      <div key={item.id} styleName="blockWrapper">
        {console.log('******* accordion item: ', item)}
        <AccordionBlock
          tree={item}
          isExpanded={index < 3}
          active={activeRowId}
          onClick={onClick}
        />
        <div styleName="separator" />
      </div>
    ))}
  </div>
);


export default Accordion;
