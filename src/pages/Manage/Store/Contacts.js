// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propOr } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { Input } from 'components/Forms';

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
};

class Contacts extends Component<PropsType, StateType> {
  state: StateType = {
    form: {},
  };

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  // TODO: extract to helper
  renderInput = (id: string, label: string) => (
    <div styleName="inputWrapper">
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
    return (
      <Container>
        <Row>
          <Col size={2}>
            menu
          </Col>
          <Col size={10}>
            <div>
              <div styleName="header">
                <span styleName="title">Контакты</span>
              </div>
              <div styleName="formContainer">
                {this.renderInput('email', 'Email')}
                {this.renderInput('phone', 'Phone')}
                {this.renderInput('social', 'Social')}
                {this.renderInput('address', 'Address')}
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
  currentUser: currentUserShape,
};

export default Page(Contacts);
