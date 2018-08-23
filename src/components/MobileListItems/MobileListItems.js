import React, { Component } from 'react';
import { Icon } from 'components/Icon';

import './MobileListItems.scss';

type PropsType = {
  items: Array<{ id: string, label: string }>,
  onClick: any => any,
  idName: string,
};

type StateType = {
  selected: ?number,
};

class MobileListItems extends Component<PropsType, StateType> {
  static defaultProps = {
    idName: 'id',
    onClick: () => {},
  };
  state = {
    selected: null,
  };
  handleSelected = (selected: number, item): void => {
    const { onClick } = this.props;
    this.setState(
      {
        selected,
      },
      () => {
        onClick(item);
      },
    );
  };
  render() {
    const { items, idName } = this.props;
    const { selected } = this.state;
    return (
      <ul styleName="container">
        {items.map((item, index) => (
          /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
          <li
            key={item[idName]}
            onClick={() => this.handleSelected(index, item)}
            onKeyPress={() => {}}
            styleName={`item ${selected === index ? 'active' : ''}`}
            tabIndex="-1"
          >
            {selected === index ? <span styleName="activeBorder" /> : null}
            <span>
              <p styleName="linkName">{item.label}</p>
            </span>
            <Icon type="arrowRight" />
          </li>
        ))}
      </ul>
    );
  }
}

export default MobileListItems;
