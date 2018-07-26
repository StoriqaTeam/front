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
  isOrder?: boolean,
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
    const { activeItem, me, isOrder } = this.props;
    // $FlowIgnoreMe
    const element = pathOr(
      null,
      [isOrder ? 'order' : activeItem],
      profileMenuMap,
    );
    return cloneElement(element, {
      me,
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
                <Col sm={3} md={3} lg={2} xl={2}>
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
                      <span styleName="title">{subtitle}</span>
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
  Page(Profile),
  graphql`
    fragment Profile_me on User {
      ...Orders_me
      ...Order_me
      ...PersonalData_me
      ...ShippingAddresses_me
      id
      rawId
      avatar
      firstName
      lastName
      provider
    }
  `,
);
