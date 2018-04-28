// @flow

import React from 'react';
import { map, addIndex } from 'ramda';

import AccordionBlock from './AccordionBlock';

import './Accordion.scss';

type TreeType = {
  name: string,
  id: number,
  children?: Array<TreeType>,
};

type PropsType = {
  items: Array<TreeType>,
  activeId: ?number,
  onClick: (item: TreeType) => void,
};

type StateType = {
  showAll: boolean,
};

const mapIndexed = addIndex(map);

class Accordion extends React.Component<PropsType, StateType> {
  state = {
    showAll: false,
  };

  handleOnToggle = () => {
    this.setState(prevState => ({ showAll: !prevState.showAll }));
  };

  render() {
    const { items, activeId, onClick } = this.props;
    const { showAll } = this.state;
    const filteredItems = showAll ? items : items.slice(0, 5);
    return (
      <div styleName="wrapper">
        {mapIndexed(
          (item, index) => (
            <div key={item.id} styleName="blockWrapper">
              <AccordionBlock
                tree={item}
                isExpanded={index < 5}
                active={activeId}
                onClick={onClick}
              />
              <div styleName="separator" />
            </div>
          ),
          filteredItems,
        )}
        {items.length > 5 && (
          <div
            styleName="showAll"
            onClick={this.handleOnToggle}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            show all
          </div>
        )}
      </div>
    );
  }
}

export default Accordion;
