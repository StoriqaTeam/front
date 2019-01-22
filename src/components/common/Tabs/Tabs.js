// @flow

import * as React from 'react';
import classNames from 'classnames';

import './Tabs.scss';

type PropsType = {
  selected: number,
  children: Array<React.Node>,
  onClick: (selected: number) => void,
};

class Tabs extends React.Component<PropsType> {
  handleClick = (selected: number) => {
    this.props.onClick(selected);
  };

  renderTitles = (): React.Element<any> => {
    const { children, selected } = this.props;

    const buildLabel = (child: any, index: number) => (
      <button
        key={index}
        styleName={classNames('label', { active: selected === index })}
        onClick={() => {
          this.handleClick(index);
        }}
      >
        <strong>{child.props.label}</strong>
      </button>
    );
    return <div styleName="labels">{children.map(buildLabel)}</div>;
  };

  render() {
    const { selected } = this.props;
    return (
      <div styleName="container">
        {this.renderTitles()}
        <div styleName="panel">{this.props.children[selected]}</div>
      </div>
    );
  }
}

export default Tabs;
