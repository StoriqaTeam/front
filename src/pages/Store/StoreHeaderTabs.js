// @flow

import React from 'react';

import './StoreHeaderTabs.scss';

type PropsType = {
  tabs: Array<{ id: string, title: string, isNew: boolean }>,
};

const StoreHeaderTabs = ({ tabs }: PropsType) => (
  <nav styleName="container">
    <ul styleName="tabs">
      {tabs.map(tab => (
        <li key={tab.id} styleName="tab">
          {tab.isNew && <strong styleName="new">New</strong>}
          <strong>{tab.title}</strong>
        </li>
      ))}
    </ul>
  </nav>
);

export default StoreHeaderTabs;
