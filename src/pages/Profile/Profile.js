// @flow

import React, { Component, cloneElement } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, find, propEq } from 'ramda';

import { AppContext, Page } from 'components/App';
import {
  PersonalData,
  ShippingAddresses,
  Security,
  KYC,
} from 'pages/Profile/items';
import { Orders } from 'pages/Profile/items/Orders';
import { Order } from 'pages/Profile/items/Order';
import Menu from 'pages/Profile/Menu';
import { Container, Row, Col } from 'layout';

import type { Profile_me as ProfileMeType } from './__generated__/Profile_me.graphql';

import './Profile.scss';

type PropsType = {
  me: ProfileMeType,
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
  { id: 'orders', title: 'My orders' },
  { id: 'order', title: '' },
  { id: 'kyc', title: 'KYC' },
];

const profileMenuMap = {
  'personal-data': <PersonalData />,
  'shipping-addresses': <ShippingAddresses />,
  security: <Security />,
  orders: <Orders />,
  order: <Order />,
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
      <AppContext.Consumer>
        {({ environment }) => (
          <div styleName="container">
            <Container>
              <Row>
                <Col sm={3} md={3} lg={2} xl={2} mdVisible>
                  <Menu
                    environment={environment}
                    activeItem={activeItem}
                    avatar={me.avatar}
                    firstName={me.firstName || ''}
                    id={me.id}
                    lastName={me.lastName || ''}
                    menuItems={menuItems}
                    provider={me.provider || null}
                  />
                </Col>
                <Col sm={9} md={9} lg={10} xl={10}>
                  <div styleName="content">
                    <div styleName="header">
                      <span styleName="title">Profile</span>
                    </div>
                    <div styleName="form">
                      {this.renderProfileItem(subtitle)}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default createFragmentContainer(
  Page(Profile, true),
  graphql`
    fragment Profile_me on User {
      ...Orders
      ...Order
      id
      rawId
      avatar
      email
      phone
      firstName
      lastName
      birthdate
      gender
      provider
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
