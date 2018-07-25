// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import { Input } from 'components/common/Input';
import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';
import { SocialShare } from 'components/SocialShare';
import ImageLoader from 'libs/react-image-loader';
import BannerLoading from 'components/Banner/BannerLoading';

import { StoreContext } from './index';

import './StoreHeaderInfo.scss';

type StateTypes = {
  search: string,
  isOpened: boolean,
  isSearch: boolean,
  isShare: boolean,
};

class StoreHeader extends Component<{}, StateTypes> {
  state = {
    search: '',
    isOpened: false,
    isSearch: false,
    isShare: false,
  };
  handleClick = (iconName: string): void => {
    const { isOpened, isSearch, isShare } = this.state;
    this.setState({
      isOpened: !(this.state[iconName] && isOpened) || (!isSearch && !isShare),
      isSearch: iconName === 'isSearch' && !this.state[iconName],
      isShare: iconName === 'isShare' && !this.state[iconName],
    });
  };
  handleInputChange = () => {};
  render() {
    const { search, isOpened, isSearch, isShare } = this.state;
    return (
      <StoreContext.Consumer>
        {({ logo, cover, name, rating }) => (
          <div styleName="container">
            <span
              styleName="share"
              role="button"
              onClick={() => this.handleClick('isShare')}
              onKeyPress={() => {}}
              tabIndex="-1"
            >
              {!isShare ? (
                <Icon type="share" size={20} />
              ) : (
                <Icon type="cross" size={20} />
              )}
            </span>
            <span
              styleName="magnifier"
              role="button"
              onClick={() => this.handleClick('isSearch')}
              onKeyPress={() => {}}
              tabIndex="-1"
            >
              {!isSearch ? (
                <Icon type="magnifier" size={20} />
              ) : (
                <Icon type="cross" size={20} />
              )}
            </span>
            <figure styleName="shopLogo">
              {logo ? (
                <ImageLoader fit src={logo} loader={<BannerLoading />} />
              ) : (
                <Icon type="camera" size="56" />
              )}
            </figure>
            <div styleName={classNames('mobileSearch', { isOpened })}>
              {/* eslint-disable no-nested-ternary */}
              {!isShare ? (
                <Input
                  id="search"
                  value={search}
                  label="Search"
                  onChange={this.handleInputChange}
                  fullWidth
                />
              ) : process.env.BROWSER ? (
                <SocialShare noBorder photoMain={cover} />
              ) : null}
            </div>
            <div>
              <h2 styleName="shopTitle">
                <strong>{name}</strong>
                <span styleName="cartIcon">
                  <Icon type="verifiedShop" size={20} />
                </span>
              </h2>
              <div styleName="shopRating">
                <div styleName="rating">
                  <Rating value={rating} />
                </div>
                <span styleName="reviews">380 Reviews</span>
              </div>
            </div>
          </div>
        )}
      </StoreContext.Consumer>
    );
  }
}

export default StoreHeader;
