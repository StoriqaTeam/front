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

type StateType = {
  showAll: boolean,
}

class Accordion extends React.Component<PropsType, StateType> {
  state = {
    showAll: false,
  }

  handleOnToggle = () => {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    const { items, activeId, onClick } = this.props;
    const { showAll } = this.state;
    const filteredItems = showAll ? items : items.slice(0, 3);
    return (
      <div styleName="wrapper">
        {filteredItems.map((item, index) => (
          <div key={item.id} styleName="blockWrapper">
            <AccordionBlock
              tree={item}
              isExpanded={index < 3}
              active={activeId}
              onClick={onClick}
            />
            <div styleName="separator" />
          </div>
        ))}
        <div
          styleName="showAll"
          onClick={this.handleOnToggle}
          onKeyDown={() => {}}
          role="button"
          tabIndex="0"
        >
          show all
        </div>
      </div>
    );
  }
}


export default Accordion;
