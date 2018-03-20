// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, propOr, pathOr, isEmpty } from 'ramda';
import { validate } from '@storiqa/validation_specs';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { Input, Textarea } from 'components/Forms';
import { Button } from 'components/Button';
import { MiniSelect } from 'components/MiniSelect';
import { log, fromRelayError } from 'utils';
import { CreateBaseProductMutation } from 'relay/mutations';

import Header from './Header';
import Menu from './Menu';
import './Product.scss';

type PropsType = {
  storeId: number,
};

type StateType = {
  form: {
    name: string,
    seoTitle: string,
    seoDesc: string,
    short_description: string,
    fullDesc: string,
    categoryId: number,
  },
};

class Product extends Component<PropsType, StateType> {
  state: StateType = {
    form: {
      name: '',
      seoTitle: '',
      seoDesc: '',
      short_description: '',
      fullDesc: '',
      categoryId: '',
    },
  };

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  handleSave = () => {
    const { errors: preValidationErrors } = validate({
      name: [[val => !isEmpty(val), 'Should not be empty']],
      short_description: [[val => !isEmpty(val), 'Should not be empty']],
    }, this.state.form);
    if (preValidationErrors) {
      this.setState({ formErrors: preValidationErrors });
      return;
    }

    this.setState({ formErrors: [] });
    const {
      form: {
        name,
        seoTitle,
        seoDesc,
        short_description,
        fullDesc,
        categoryId,
      },
    } = this.state;

    CreateBaseProductMutation.commit({
      name: [{ lang: 'EN', text: name }],
      storeId: parseInt(this.props.storeId, 10),
      shortDescription: [{ lang: 'EN', text: short_description }],
      longDescription: [{ lang: 'EN', text: fullDesc }],
      currencyId: 1,
      categoryId: 1,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }
        alert('Something going wrong :(');
      },
    });
  };

  renderInput = (id: string, label: string, icon?: string) => (
    <div styleName="formItem">
      <Input
        isUrl={Boolean(icon)}
        icon={icon}
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  renderTextarea = (id: string, label: string) => (
    <div styleName="formItem">
      <Textarea
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
            <Menu
              activeItem=""
              switchMenu={() => {}}
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Header title="Товары" />
              <div styleName="form">
                {this.renderInput('name', 'Product name')}
                {this.renderInput('seoTitle', 'SEO title')}
                {this.renderInput('seoDesc', 'SEO description')}
                {this.renderTextarea('short_description', 'Short description')}
                {this.renderTextarea('fullDesc', 'Full description')}
                { /* category selector here */ }
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

Product.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Page(Product);
