// @flow strict

import React, { PureComponent } from 'react';
import { pathOr, keys } from 'ramda';
import classNames from 'classnames';

import ArrowExpand from 'components/Icon/svg/arrowExpand.svg';
import ArrowLeft from 'components/Icon/svg/arrowLeft.svg';
import ArrowRight from 'components/Icon/svg/arrowRight.svg';
import ArrowSelect from 'components/Icon/svg/arrowSelect.svg';
import Basket from 'components/Icon/svg/basket.svg';
import BurgerMenu from 'components/Icon/svg/menu-button.svg';
import Camera from 'components/Icon/svg/camera.svg';
import CameraPlus from 'components/Icon/svg/cameraPlus.svg';
import Cart from 'components/Icon/svg/cart.svg';
import Cats from 'components/Icon/svg/cats.svg';
import CloseArrow from 'components/Icon/svg/closeArrow.svg';
import Controls from 'components/Icon/svg/controls.svg';
import Cross from 'components/Icon/svg/cross.svg';
import CrossWhite from 'components/Icon/svg/crossWhite.svg';
import Email from 'components/Icon/svg/email.svg';
import Eye from 'components/Icon/svg/eye.svg';
import EyeBlue from 'components/Icon/svg/eyeBlue.svg';
import Facebook from 'components/Icon/svg/facebook.svg';
import FacebookGray from 'components/Icon/svg/facebook_gray.svg';
import MediumGray from 'components/Icon/svg/medium_gray.svg';
import RedditGray from 'components/Icon/svg/reddit_gray.svg';
import Google from 'components/Icon/svg/google.svg';
import Heart from 'components/Icon/svg/heart.svg';
import Instagram from 'components/Icon/svg/instagram.svg';
import InstagramGray from 'components/Icon/svg/instagram_gray.svg';
import YoutubeGray from 'components/Icon/svg/youtube_gray.svg';
import LeftArrowSlider from 'components/Icon/svg/leftArrowSlider.svg';
import Login from 'components/Icon/svg/login.svg';
import Logo from 'components/Icon/svg/logo.svg';
import Logout from 'components/Icon/svg/logout.svg';
import Magnifier from 'components/Icon/svg/magnifier.svg';
import Minus from 'components/Icon/svg/minus.svg';
import Next from 'components/Icon/svg/next.svg';
import Note from 'components/Icon/svg/note.svg';
import OpenArrow from 'components/Icon/svg/openArrow.svg';
import Pencil from 'components/Icon/svg/pencil.svg';
import Person from 'components/Icon/svg/person.svg';
import Phone from 'components/Icon/svg/phone.svg';
import PinterestGray from 'components/Icon/svg/pinterest_gray.svg';
import Plus from 'components/Icon/svg/plus.svg';
import Prev from 'components/Icon/svg/prev.svg';
import QA from 'components/Icon/svg/qa.svg';
import QualityAssurance from 'components/Icon/svg/quality_assurance.svg';
import RightArrowSlider from 'components/Icon/svg/rightArrowSlider.svg';
import Share from 'components/Icon/svg/share.svg';
import Telegram from 'components/Icon/svg/telegram.svg';
import Twitter from 'components/Icon/svg/twitter.svg';
import TwitterGray from 'components/Icon/svg/twitter_gray.svg';
import Upload from 'components/Icon/svg/upload.svg';
import VkGray from 'components/Icon/svg/vk_gray.svg';
import Move from 'components/Icon/svg/move.svg';
import EmptyCart from 'components/Icon/svg/emptyCart.svg';
import VerifiedShop from 'components/Icon/svg/verifiedShop.svg';
import SearchNoResults from 'components/Icon/svg/searchNoResults.svg';
import Status from 'components/Icon/svg/status.svg';
import Calendar from 'components/Icon/svg/calendar.svg';
import Copy from 'components/Icon/svg/copy.svg';
import Coupon from 'components/Icon/svg/coupon.svg';

// For product
import MainFoto from 'components/Icon/svg/product/mainFoto.svg';
import AngleView from 'components/Icon/svg/product/angleView.svg';
import ShowDetails from 'components/Icon/svg/product/showDetails.svg';
import ShowInScene from 'components/Icon/svg/product/showInScene.svg';
import ShowInUse from 'components/Icon/svg/product/showInUse.svg';
import ShowSizes from 'components/Icon/svg/product/showSizes.svg';
import ShowVariety from 'components/Icon/svg/product/showVariety.svg';

import SortArrows from 'components/Icon/svg/sortArrows.svg';
import User from 'components/Icon/svg/user.svg';
import Chat from 'components/Icon/svg/chat.svg';
import AddVariant from 'components/Icon/svg/addVariant.svg';

import type { IconSizeType } from 'types';

import './Icon.scss';

type PropsTypes = {
  type: string,
  size: IconSizeType,
  inline: boolean,
  dataTest: string,
};

const iconsMap = {
  arrowExpand: <ArrowExpand />,
  arrowLeft: <ArrowLeft />,
  arrowRight: <ArrowRight />,
  arrowSelect: <ArrowSelect />,
  basket: <Basket />,
  burgerMenu: <BurgerMenu />,
  camera: <Camera />,
  cameraPlus: <CameraPlus />,
  cart: <Cart />,
  cats: <Cats />,
  chat: <Chat />,
  closeArrow: <CloseArrow />,
  controls: <Controls />,
  cross: <Cross />,
  crossWhite: <CrossWhite />,
  email: <Email />,
  eye: <Eye />,
  eyeBlue: <EyeBlue />,
  facebook: <Facebook />,
  facebookGray: <FacebookGray />,
  mediumGray: <MediumGray />,
  redditGray: <RedditGray />,
  google: <Google />,
  heart: <Heart />,
  instagram: <Instagram />,
  instagramGray: <InstagramGray />,
  youtubeGray: <YoutubeGray />,
  leftArrowSlider: <LeftArrowSlider />,
  login: <Login />,
  logo: <Logo />,
  //
  logout: <Logout />,
  magnifier: <Magnifier />,
  minus: <Minus />,
  next: <Next />,
  note: <Note />,
  openArrow: <OpenArrow />,
  pencil: <Pencil />,
  person: <Person />,
  phone: <Phone />,
  pinterestGray: <PinterestGray />,
  plus: <Plus />,
  prev: <Prev />,
  qa: <QA />,
  qualityAssurance: <QualityAssurance />,
  rightArrowSlider: <RightArrowSlider />,
  share: <Share />,
  verifiedShop: <VerifiedShop />,
  sortArrows: <SortArrows />,
  telegram: <Telegram />,
  twitter: <Twitter />,
  twitterGray: <TwitterGray />,
  upload: <Upload />,
  user: <User />,
  vkGray: <VkGray />,
  move: <Move />,
  emptyCart: <EmptyCart />,
  searchNoResults: <SearchNoResults />,
  status: <Status />,
  calendar: <Calendar />,
  addVariant: <AddVariant />,
  copy: <Copy />,
  coupon: <Coupon />,
  //

  // For product
  mainFoto: <MainFoto />,
  angleView: <AngleView />,
  showDetails: <ShowDetails />,
  showInScene: <ShowInScene />,
  showInUse: <ShowInUse />,
  showSizes: <ShowSizes />,
  showVariety: <ShowVariety />,
};

export const iconNames = keys(iconsMap);

class Icon extends PureComponent<PropsTypes> {
  static defaultProps = {
    inline: false,
    size: 16,
    dataTest: 'icon',
  };
  render() {
    const { type, size, inline, dataTest } = this.props;
    return (
      <div
        data-test={dataTest}
        styleName={classNames('container', {
          [`size-${size || '16'}`]: type !== 'logo',
          isLogo: type === 'logo',
          inline,
        })}
      >
        {pathOr(null, [type], iconsMap)}
      </div>
    );
  }
}

export default Icon;
