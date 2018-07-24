import React from 'react';
import { Link } from 'found';

import { Icon } from 'components/Icon';

import { convertSrc, extractText } from 'utils';

import './StoresData.scss';

type PropsType = {
  store: {
    name: Array<{
      lang: string,
      text: string,
    }>,
    rawId: number,
    id: string,
    productsCount: number,
    logo: ?string,
  },
};

const StoresData = ({ store }: PropsType) => (
  <Link to={`/store/${store.rawId}`} styleName="container">
    <div styleName="storeLogo" data-test="storeLink">
      {store.logo ? (
        <img src={convertSrc(store.logo, 'small')} alt="img" />
      ) : (
        <Icon type="camera" size="32" />
      )}
    </div>
    <div styleName="storeInfo">
      <div styleName="storeName">{extractText(store.name)}</div>
      <div styleName="storeAdd">
        <span>97,5% reviews</span>
        {store.productsCount && (
          <span styleName="productsCount">{store.productsCount} goods</span>
        )}
      </div>
    </div>
  </Link>
);

export default StoresData;
