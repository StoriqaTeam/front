// @flow strict

import React from 'react';
import { Link } from 'found';
import classNames from 'classnames';

import './StoreHeaderTabs.scss';

import t from './i18n';

type PropsType = {
  tabs: Array<{ id: string, title: string, isNew: boolean, link: string }>,
  storeId: number,
  active: ?string,
};

const StoreHeaderTabs = ({ tabs, storeId, active }: PropsType) => (
  <nav styleName="container">
    <div styleName="tabs">
      {tabs.map(
        tab =>
          tab.link !== null ? (
            <Link
              to={`/store/${storeId}${tab.link}`}
              key={tab.id}
              //
              styleName={classNames('tab', { active: active === tab.id })}
            >
              <strong styleName="text">
                {tab.title}
                {tab.isNew && <span styleName="new">{t.new}</span>}
              </strong>
            </Link>
          ) : (
            <div key={tab.id} styleName="tab">
              <strong styleName="text">
                {tab.title}
                {tab.isNew && <span styleName="new">{t.new}</span>}
              </strong>
            </div>
          ),
      )}
    </div>
  </nav>
);

export default StoreHeaderTabs;
