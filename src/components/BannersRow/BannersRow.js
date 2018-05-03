// @flow

import React, { PureComponent } from 'react';
import { slice } from 'ramda';

import { Banner } from 'components/Banner';

import './BannersRow.scss';

type PropsTypes = {
  items: Array<{
    id: any,
  }>,
  count?: number,
};

class BannersRow extends PureComponent<PropsTypes> {
  render() {
    const { count = 1, items } = this.props;
    const visibleBanners = slice(0, count, items);
    const width = count ? 100 / count : 100;
    return (
      <div styleName="container">
        {visibleBanners &&
          visibleBanners.length &&
          visibleBanners.map(item => (
            <div key={item.id} style={{ width: `${width}%` }} styleName="item">
              <Banner item={item} />
            </div>
          ))}
      </div>
    );
  }
}

export default BannersRow;
