// @flow strict

import React, { PureComponent } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';
import { map } from 'ramda';

import './Tabs.scss';

type PropsType = {
  tabs: Array<{
    id: string,
    label: string,
  }>,
  activeTab: string,
  onChangeTab: (id: string) => void,
  children: Node,
};

class Tabs extends PureComponent<PropsType> {
  render() {
    const { tabs, onChangeTab, activeTab } = this.props;
    return (
      <div styleName="container">
        <div styleName="head">
          {map(
            item => (
              <div
                key={item.id}
                styleName={classNames('tab', { active: item.id === activeTab })}
                onClick={() => {
                  onChangeTab(item.id);
                }}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
                data-test={`${item.id}Tab`}
              >
                {item.label}
              </div>
            ),
            tabs,
          )}
        </div>
        <div styleName="body">{this.props.children}</div>
      </div>
    );
  }
}

export default Tabs;
