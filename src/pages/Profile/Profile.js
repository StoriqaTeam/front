// @flow

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { pathOr, find, propEq } from 'ramda';
// import { createFragmentContainer, graphql } from 'react-relay';

// import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { PersonalData } from 'pages/Profile/PersonalData';
import { ShippingAddresses } from 'pages/Profile/ShippingAddresses';
import { Security } from 'pages/Profile/Security';
import { KYC } from 'pages/Profile/KYC';
// import { UpdateStoreMainMutation } from 'relay/mutations';
import { Container, Row, Col } from 'layout';
// import { log, fromRelayError } from 'utils';

// import Form from './Form';
import Menu from './Menu';

import './Profile.scss';

type PropsType = {
  activeItem: string,
};

type StateType = {
  //
};

const menuItems = [
  { id: 'personal-data', title: 'Personal data' },
  { id: 'shipping-addresses', title: 'Shipping addresses' },
  { id: 'security', title: 'Security' },
  { id: 'kyc', title: 'KYC' },
];

const profileMenuMap = {
  'personal-data': <PersonalData />,
  'shipping-addresses': <ShippingAddresses />,
  security: <Security />,
  kyc: <KYC />,
};

class Profile extends Component<PropsType> {
  // constructor(props: PropsType) {
  //   super(props);
  //   this.state = {
  //     profileMenuMap: {
  //       'personal-data': <PersonalData />,
  //       'shipping-addresses': <ShippingAddresses />,
  //       'security': <Security />,
  //       'kyc': <KYC />,
  //     }
  //   }
  // }

  onLogoUpload = url => {
    // console.log('---url', url);
  };

  renderProfileItem = () => {
    const { activeItem, me } = this.props;
    return pathOr(null, [activeItem], profileMenuMap);
  };

  render() {
    const { activeItem, me } = this.props;
    console.log('---me', me);
    const { title } = find(propEq('id', activeItem), menuItems);
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              menuItems={menuItems}
              activeItem={activeItem}
              onLogoUpload={this.onLogoUpload}
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <div styleName="header">
                <span styleName="title">Profile</span>
              </div>
              <div styleName="form">
                <div styleName="subtitle">
                  <strong>{title}</strong>
                </div>
                {pathOr(null, [activeItem], profileMenuMap)}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Page(Profile);
