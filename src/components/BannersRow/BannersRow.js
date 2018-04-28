// @flow

import React, { PureComponent } from 'react';
import { slice, head } from 'ramda';

import { Banner } from 'components/Banner';

import './BannersRow.scss';

type PropsTypes = {
  items: Array<{}>,
  count: ?number,
};

class BannersRow extends PureComponent<PropsTypes> {
  render() {
    const { count, items } = this.props;
    const visibleBanners = count ? slice(0, count, items) : [head(items)];
    const width = count ? 100 / count : 100;
    return (
      <div styleName="container">
        {visibleBanners.map(item => (
          <div key={item.id} style={{ width: `${width}%` }} styleName="item">
            <Banner item={item} />
          </div>
        ))}
      </div>
    );
  }
}

export default BannersRow;
