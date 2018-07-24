// @flow

import React from 'react';

import './StoreHeaderTabs.scss';

const tabs = [
  {
    id: '0',
    title: 'Show',
    isNew: false,
  },
  {
    id: '1',
    title: 'Items',
    isNew: false,
  },
  {
    id: '2',
    title: 'Reviews',
    isNew: false,
  },
  {
    id: '3',
    title: 'Actions',
    isNew: true,
  },
  {
    id: '4',
    title: 'About',
    isNew: false,
  },
];

const StoreHeaderTabs = () => (
  <nav styleName="container">
    <ul styleName="tabs">
      {tabs.map(tab => (
        <li key={tab.id} styleName="tab">
          {tab.isNew ? (<span styleName="new">New</span>) : null}
          { tab.title }
        </li>
      ))}
    </ul>
  </nav>
);

export default StoreHeaderTabs;
