// @flow

import * as React from 'react';
import classNames from 'classnames';

import { Count } from 'components/Count';

import './Tabs.scss';

type PropsType = {
  selected: number,
  children: Array<React.Node>,
  onClick: (selected: number) => void,
  withoutPanel?: boolean,
};

class Tabs extends React.Component<PropsType> {
  handleClick = (selected: number) => {
    this.props.onClick(selected);
  };

  renderTitles = (): React.Element<any> => {
    const { children, selected } = this.props;

    const buildLabel = (child: any, index: number) => {
      const { label, amount } = child.props;
      return (
        <button
          key={index}
          styleName={classNames('label', { active: selected === index })}
          onClick={() => {
            this.handleClick(index);
          }}
        >
          <strong styleName="labelText">{label}</strong>
          {Boolean(amount) && (
            <div styleName="amount">
              <Count amount={amount} type="blue" />
            </div>
          )}
        </button>
      );
    };
    return <div styleName="labels">{children.map(buildLabel)}</div>;
  };

  render() {
    const { selected, withoutPanel } = this.props;
    return (
      <div styleName="container">
        {this.renderTitles()}
        {!withoutPanel && (
          <div styleName="panel">{this.props.children[selected]}</div>
        )}
      </div>
    );
  }
}

export default Tabs;
