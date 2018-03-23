// @flow

import React, { PureComponent } from 'react';
import { slice } from 'ramda';

import { Banner } from 'components/Banner';

import './BannersRow.scss';

type PropsTypes = {
  banners: Array<{}>,
  count: ?number,
};

class BannersRow extends PureComponent<PropsTypes> {
  render() {
    const { count, banners } = this.props;
    const visibleBanners = slice(0, count, banners);
    const width = 100 / count;
    return (
      <div styleName="container">
        {visibleBanners.map(item => (
          <div
            style={{ width: `${width}%`}}
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
