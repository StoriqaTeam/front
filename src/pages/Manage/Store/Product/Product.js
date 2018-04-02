// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, propOr, pathOr, isEmpty } from 'ramda';
import { validate } from '@storiqa/shared';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { Input, Textarea } from 'components/Forms';
import { CategorySelector } from 'components/CategorySelector';
import { Button } from 'components/Button';
import { log, fromRelayError } from 'utils';
import { CreateBaseProductMutation } from 'relay/mutations';

import Header from '../Header';
import Menu from '../Menu';
import './Product.scss';

type PropsType = {
  storeId: number,
};

type StateType = {
  form: {
    name: string,
    seoTitle: string,
    seoDescription: string,
    short_description: string,
    fullDesc: string,
    categoryId: ?number,
  },
  formErrors: {},
};

class Product extends Component<PropsType, StateType> {
  state: StateType = {
    form: {
      name: '',
      seoTitle: '',
      seoDescription: '',
      short_description: '',
      fullDesc: '',
      categoryId: null,
    },
    formErrors: {},
  };

  handleInputChange = (id: string) => (e: any) => {
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState(assocPath(['form', id], value.replace(/\s\s/, ' ')));
    }
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

    this.setState({ formErrors: {} });
    const {
      form: {
        name,
        seoTitle,
        seoDescription,
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
      categoryId,
      seoTitle,
      seoDescription,
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

  /* eslint-disable */
  renderInput = ({
    id,
    label,
    limit,
    icon,
  }: {
    id: string,
    label: string,
    icon?: string,
    limit?: number
  }) => (
  /* eslint-enable */
    <div styleName="formItem">
      <Input
        isUrl={Boolean(icon)}
        icon={icon}
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        limit={limit}
      />
    </div>
  );

  /* eslint-disable */
  renderTextarea = ({
    id,
    label,
  }: {
    id: string,
    label: string,
  }) => (
  /* eslint-enable */
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
                {this.renderInput({ id: 'name', label: 'Product name', limit: 50 })}
                {this.renderInput({ id: 'seoTitle', label: 'SEO title', limit: 50 })}
                {this.renderTextarea({ id: 'seoDescription', label: 'SEO description' })}
                {this.renderTextarea({ id: 'short_description', label: 'Short description' })}
                {this.renderTextarea({ id: 'fullDesc', label: 'Full description' })}
                { /* category selector here */ }
                <div styleName="formItem">
                  <CategorySelector
                    categories={this.context.directories.categories}
                    onSelect={(categoryId) => {
                      this.setState({
                        form: {
                          ...this.state.form,
                          categoryId,
                        },
                      });
                    }}
                  />
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

Product.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object.isRequired,
};

export default Page(Product);
