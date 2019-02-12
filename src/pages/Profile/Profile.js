// @flow

import React, { PureComponent, cloneElement } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, find, propEq, reject } from 'ramda';

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

import t from './i18n';

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

const profileMenuMap = {
  'personal-data': <PersonalData />,
  'shipping-addresses': <ShippingAddresses />,
  security: <Security />,
  orders: <Orders />,
  order: <Order />,
  kyc: <KYC />,
};

class Profile extends PureComponent<PropsType, StateType> {
  checkMenuItems = (): Array<{ id: string, title: string }> => {
    const menuItems = [
      { id: 'personal-data', title: t.personalData },
      { id: 'shipping-addresses', title: t.shippingAddresses },
      { id: 'security', title: t.security },
      { id: 'orders', title: t.myOrders },
      // { id: 'kyc', title: 'KYC' },
    ];
    const {
      me: { provider },
    } = this.props;
    if (provider === 'FACEBOOK' || provider === 'GOOGLE') {
      return reject(item => item.id === 'security', menuItems);
    }
    return menuItems;
  };
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
    const { title: subtitle } = find(
      propEq('id', activeItem),
      this.checkMenuItems(),
    );
    return (
      <AppContext.Consumer>
        {({ environment }) => (
          <div styleName="container">
            <Container>
              <Row>
                <Col md={3} lg={2} xl={2}>
                  <Menu
                    activeItem={activeItem}
                    avatar={me.avatar}
                    environment={environment}
                    firstName={me.firstName || ''}
                    id={me.id}
                    lastName={me.lastName || ''}
                    menuItems={this.checkMenuItems()}
                    provider={me.provider || null}
                  />
                </Col>
                <Col md={9} lg={10} xl={10}>
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
    fragment Profile_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      ...Orders_me
      ...Order_me @arguments(slug: $slug)
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
