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
  items: Array<TreeType>,
  activeId: ?number,
  onClick: (item: TreeType) => void,
}

const Accordion = ({ activeId, onClick, items }: PropsType) => (
  <div styleName="wrapper">
    {items.map((item, index) => (
      <div key={item.id} styleName="blockWrapper">
        {/* {console.log('******* accordion item: ', item)} */}
        <AccordionBlock
          tree={item}
          isExpanded={index < 3}
          active={activeId}
          onClick={onClick}
        />
        <div styleName="separator" />
      </div>
    ))}
  </div>
);


export default Accordion;
