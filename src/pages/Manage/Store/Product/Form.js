// @flow

import React, { Component } from 'react';
import { assocPath, propOr, isEmpty, complement, pathOr } from 'ramda';
import { validate } from '@storiqa/shared';

import { CategorySelector } from 'components/CategorySelector';
import { Button } from 'components/Button';
import { Input, Textarea } from 'components/Forms';
import { renameKeys } from 'utils/ramda';

import Header from '../Header';

import './Product.scss';

type PropsType = {
  baseProduct: ?{},
  onSave: Function,
  validationErrors: ?{},
  categories: Array<{}>,
};

type StateType = {
  form: {
    name: string,
    seoTitle: string,
    seoDescription: string,
    shortDescription: string,
    fullDesc: string,
    categoryId: ?number,
  },
  formErrors: {},
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { baseProduct } = this.props;
    console.log({baseProduct})
    if (!baseProduct) {
      return;
    }
    this.state = {
      form: {
        name: pathOr('', ['name', 0, 'text'], baseProduct),
        seoTitle: pathOr('', ['seoTitle', 0, 'text'], baseProduct),
        seoDescription: pathOr('', ['seoDescription', 0, 'text'], baseProduct),
        shortDescription: pathOr('', ['shortDescription', 0, 'text'], baseProduct),
        fullDesc: pathOr('', ['longDescription', 0, 'text'], baseProduct),
        categoryId: baseProduct.category.rawId,
      },
      formErrors: {},
    };
  }

  state: StateType = {
    form: {
      name: '',
      seoTitle: '',
      seoDescription: '',
      shortDescription: '',
      fullDesc: '',
      categoryId: null,
    },
    formErrors: {},
  };

  componentWillReceiveProps(nextProps: PropsType) {
    const currentFormErrors = this.state.formErrors;
    const nextFormErrors = nextProps.validationErrors;
    if (isEmpty(currentFormErrors) && complement(isEmpty(nextFormErrors))) {
      // конвертнем имена с snakeCase в camel_case :)
      const formErrors = renameKeys({
        long_description: 'fullDesc',
        short_description: 'shortDescription',
        seo_title: 'seoTitle',
        seo_description: 'seoDescription',
      }, nextFormErrors);
      this.setState({ formErrors });
    }
  }

  validate = () => {
    // TODO: вынести спеки
    const { errors } = validate({
      name: [[val => !isEmpty(val), 'Should not be empty']],
      shortDescription: [[val => !isEmpty(val), 'Should not be empty']],
      fullDesc: [[val => !isEmpty(val), 'Should not be empty']],
    }, this.state.form);
    return errors;
  };

  handleSave = (): ?{} => {
    this.setState({ formErrors: {} });
    const preValidationErrors = this.validate();
    if (preValidationErrors) {
      this.setState({ formErrors: preValidationErrors });
      return;
    }
    this.props.onSave({ ...this.state.form });
  };

  handleInputChange = (id: string) => (e: any) => {
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState(assocPath(['form', id], value.replace(/\s\s/, ' ')));
    }
  };

  // eslint-disable-next-line
  renderInput = ({ id, label, limit, icon }) => (
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

  renderTextarea = ({ id, label }) => (
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
      <div styleName="container">
        <Header title="Товары" />
        <div styleName="form">
          {this.renderInput({ id: 'name', label: 'Product name', limit: 50 })}
          {this.renderInput({ id: 'seoTitle', label: 'SEO title', limit: 50 })}
          {this.renderTextarea({ id: 'seoDescription', label: 'SEO description' })}
          {this.renderTextarea({ id: 'shortDescription', label: 'Short description' })}
          {this.renderTextarea({ id: 'fullDesc', label: 'Full description' })}
          <div styleName="formItem">
            <CategorySelector
              categories={this.props.categories}
              onSelect={(itemId) => {
                this.setState({
                  form: {
                    ...this.state.form,
                    categoryId: itemId,
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
    );
  }
}

export default Form;
