// @flow

import React, { Component, cloneElement } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, find, propEq } from 'ramda';

import { Page } from 'components/App';
import {
  PersonalData,
  ShippingAddresses,
  Security,
  KYC,
} from 'pages/Profile/items';
import Menu from 'pages/Profile/Menu';
import { Container, Row, Col } from 'layout';

import type { Profile_me as ProfileMe } from './__generated__/Profile_me.graphql';

import './Profile.scss';

type PropsType = {
  me: ProfileMe,
  activeItem: string,
};

type StateType = {
  isLoading: boolean,
  formErrors: ?{
    [string]: ?any,
  },
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

class Profile extends Component<PropsType, StateType> {
  renderProfileItem = subtitle => {
    const { activeItem, me } = this.props;
    // $FlowIgnoreMe
    const element = pathOr(null, [activeItem], profileMenuMap);
    return cloneElement(element, {
      data: me,
      subtitle,
    });
  };

  render() {
    const { activeItem, me } = this.props;
    // $FlowIgnoreMe
    const { title: subtitle } = find(propEq('id', activeItem), menuItems);
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              id={me.id}
              avatar={me.avatar}
              menuItems={menuItems}
              activeItem={activeItem}
              firstName={me.firstName || ''}
              lastName={me.lastName || ''}
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <div styleName="header">
                <span styleName="title">Profile</span>
              </div>
              <div styleName="form">{this.renderProfileItem(subtitle)}</div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default createFragmentContainer(
  Page(Profile),
  graphql`
    fragment Profile_me on User {
      id
      rawId
      avatar
      email
      phone
      firstName
      lastName
      birthdate
      gender
      deliveryAddresses {
        rawId
        id
        userId
        isPriority
        address {
          country
          administrativeAreaLevel1
          administrativeAreaLevel2
          political
          postalCode
          streetNumber
          value
          route
          locality
        }
      }
    }
  `,
);
