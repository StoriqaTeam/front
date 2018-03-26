// @flow

import React, { PureComponent } from 'react';
import { slice, head } from 'ramda';

import { Banner } from 'components/Banner';

import './BannersRow.scss';

type PropsTypes = {
  banners: Array<{}>,
  count: ?number,
};

class BannersRow extends PureComponent<PropsTypes> {
  render() {
    const { count, banners } = this.props;
    const visibleBanners = count ? slice(0, count, banners) : [head(banners)];
    const width = count ? 100 / count : 100;
    return (
      <div styleName="container">
        {visibleBanners.map(item => (
          <div
            key={item.id}
            style={{ width: `${width}%` }}
            styleName="item"
          >
            <Banner banner={item} />
          </div>
        ))}
      </div>
    );
  }
}

export default BannersRow;
