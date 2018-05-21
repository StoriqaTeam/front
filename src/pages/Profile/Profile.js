// @flow

import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, find, propEq, omit } from 'ramda';
import { validate } from '@storiqa/shared';

import { Page } from 'components/App';
import {
  PersonalData,
  ShippingAddresses,
  Security,
  KYC,
} from 'pages/Profile/items';
import Menu from 'pages/Profile/Menu';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';
import { renameKeys } from 'utils/ramda';

import { UpdateUserMutation } from 'relay/mutations';

import type { MutationParamsType } from 'relay/mutations/UpdateUserMutation';
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
  state = {
    isLoading: false,
    formErrors: null,
  };

  onLogoUpload = url => {
    log.info(url);
  };

  handleSave = data => {
    const { environment } = this.context;
    const { me } = this.props;
    const newData = {
      ...me,
      ...data,
      firstName: data.first_name,
      lastName: data.last_name,
    };
    const {
      phone,
      firstName,
      lastName,
      middleName,
      birthdate,
      gender,
      isActive,
    } = newData;

    let { errors: formErrors } = validate(
      {
        firstName: [
          [
            (value: string) => value && value.length > 0,
            'First name must not be empty',
          ],
        ],
        lastName: [
          [
            (value: string) => value && value.length > 0,
            'Last name must not be empty',
          ],
        ],
        phone: [
          [
            (value: string) => /^\+?\d{7}\d*$/.test(value),
            'Incorrect phone format',
          ],
        ],
      },
      {
        firstName,
        lastName,
        phone,
      },
    );

    if (formErrors) {
      formErrors = renameKeys(
        {
          firstName: 'first_name',
          lastName: 'last_name',
        },
        formErrors,
      );
      this.setState({ formErrors });
      return;
    }

    this.setState(() => ({ isLoading: true }));

    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        id: newData.id,
        phone,
        firstName,
        lastName,
        middleName,
        birthdate,
        gender,
        isActive,
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
        }
        this.setState(() => ({ isLoading: false }));
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });

        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          return;
        }
        // eslint-disable-next-line
        alert('Something going wrong :(');
      },
    };
    UpdateUserMutation.commit(params);
  };

  updateFormErrors = id => {
    // $FlowIgnoreMe
    this.setState({ formErrors: omit([id], this.state.formErrors) });
  };

  renderProfileItem = subtitle => {
    const { handleSave, updateFormErrors } = this;
    const { activeItem, me } = this.props;
    const { formErrors, isLoading } = this.state;
    // $FlowIgnoreMe
    const element = pathOr(null, [activeItem], profileMenuMap);
    return cloneElement(element, {
      data: me,
      formErrors,
      handleSave,
      isLoading,
      updateFormErrors,
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
              menuItems={menuItems}
              activeItem={activeItem}
              onLogoUpload={this.onLogoUpload}
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

Profile.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  Page(Profile),
  graphql`
    fragment Profile_me on User {
      id
      rawId
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
