// @flow

import React from 'react';
import classNames from 'classnames';
import { find, whereEq } from 'ramda';

import { Icon } from 'components/Icon';

import './AccordionBlock.scss';

type TreeType = {
  name: string,
  id: number,
  children?: Array<TreeType>,
}

type PropsType = {
  tree: TreeType,
  isExpanded?: boolean,
  active: ?number,
  onClick: (item: TreeType) => void,
}

type StateType = {
  isExpanded: boolean,
}

class AccordionBlock extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    // check for isExpanded accordionBlock
    // isExpanded имеет приоритет по отношению к проверке на активный элемент
    if (props.active && props.tree.children) {
      const findContainsActive = find(whereEq({ id: props.active }));
      const isContains = findContainsActive(props.tree.children);
      this.state = {
        isExpanded: props.isExpanded === undefined ? Boolean(isContains) : props.isExpanded,
      };
    } else {
      this.state = {
        isExpanded: Boolean(props.isExpanded),
      };
    }
  }

  handleOnToggle = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  render() {
    const { tree, active, onClick } = this.props;
    const { isExpanded } = this.state;
    return (
      <div>
        <div
          onClick={this.handleOnToggle}
          styleName="parentTitleContainer"
          onKeyDown={() => { }}
          role="button"
          tabIndex="0"
        >
          <div styleName="parentTitle">
            {tree.name}
          </div>
          {isExpanded && <Icon type="minus" size={16} />}
          {!isExpanded && <Icon type="plus" size={16} />}
        </div>
        {isExpanded &&
          <div styleName="childrenContainer">
            {tree.children && tree.children.map((child => (
              <div
                key={child.id}
                styleName={classNames('item', { active: active === child.id })}
                onClick={() => onClick(child)}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                {child.name}
              </div>
            )))}
          </div>
        }
      </div>
    );
  }
}

export default AccordionBlock;
