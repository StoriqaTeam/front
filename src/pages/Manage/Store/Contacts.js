// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, propOr } from 'ramda';
import { validate } from '@storiqa/validation_specs';
import { createFragmentContainer, graphql } from 'react-relay';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { Input } from 'components/Forms';
import { Button } from 'components/Button';
import { log, fromRelayError } from 'utils';

import Header from './Header';
import Menu from './Menu';

import './Contacts.scss';

type PropsType = {
  //
};

type StateType = {
  form: {
    [string]: ?any,
  },
  formErrors: {
    [string]: ?any,
  },
  activeItem: string,
};

class Contacts extends Component<PropsType, StateType> {
  state: StateType = {
    form: {},
    activeItem: 'contacts',
  };

  componentDidMount() {
    this.props.relay.refetch({ storeId: this.props.params.storeId });
  }
  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  handleSave = () => {
    const { currentUser, environment } = this.context;
    if (!currentUser || !currentUser.rawId) {
      return;
    }

    const {
      form: {
        email,
        phone,
        social,
        address,
        city,
        state,
        zip,
        country,
      },
    } = this.state;

    // TODO: вынести в либу спеки
    const { errors: formErrors } = validate({
      email: [[(value: string) => value && value.length > 0, 'Should not be empty']],
    }, {
      email,
      phone,
      social,
      address,
      city,
      state,
      zip,
      country,
    });
    if (formErrors) {
      this.setState({ formErrors });
      return;
    }

    this.setState({ formErrors: {} });
    currentUserShape.commit({
      userId: parseInt(currentUser.rawId, 10),
      email,
      phone,
      social,
      address,
      city,
      state,
      zip,
      country,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        const validationErrors = pathOr(null, ['100', 'message'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }
        alert('Something going wrong :(');
      },
    });
  };

  // TODO: extract to helper
  renderInput = (id: string, label: string) => (
    <div styleName="formItem">
      <Input
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  render() {
    const { activeItem } = this.state;

    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem={activeItem}
              switchMenu={this.switchMenu}
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Header title="Контакты" />
              <div styleName="form">
                {this.renderInput('email', 'Email')}
                {this.renderInput('phone', 'Phone')}
                {this.renderInput('social', 'Social')}
                {this.renderInput('address', 'Address')}
                <div styleName="formItem">
                  <Row>
                    <Col size={3}>
                      {this.renderInput('city', 'City')}
                    </Col>
                    <Col size={3}>
                      {this.renderInput('state', 'State / Province / Region')}
                    </Col>
                  </Row>
                </div>
                <div styleName="formItem">
                  <Row>
                    <Col size={3}>
                      {this.renderInput('zip', 'ZIP / Postal code')}
                    </Col>
                    <Col size={3}>
                      {this.renderInput('country', 'Country')}
                    </Col>
                  </Row>
                </div>
                <div styleName="formItem">
                  <Button
                    type="button"
                    onClick={this.handleSave}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

Contacts.contextTypes = {
  environment: PropTypes.object.isRequired,
};

// @argumentDefinitions(
//   count: {type: "Int", defaultValue: 10},  # Optional argument
// userID: {type: "ID"},                    # Required argument
// )

export default createFragmentContainer(
  Page(Contacts),
  graphql`
    fragment Contacts_me on User @argumentDefinitions(storeId: { type: "ID!", defaultValue: "0" }) {
      id
      store(id: $storeId) {
        id
        name {
          lang
          text
        }
      }
    }
  `,
);
