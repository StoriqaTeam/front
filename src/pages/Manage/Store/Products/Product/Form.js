// @flow

import React, { Component } from 'react';
import { assocPath, prop, propOr, isEmpty, omit } from 'ramda';
import { validate } from '@storiqa/shared';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { Button } from 'components/common/Button';
import { CategorySelector } from 'components/CategorySelector';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { renameKeys } from 'utils/ramda';
import { getNameText } from 'utils';

import './Product.scss';

type LangTextType = Array<{
  lang: string,
  text: string,
}>;

type BaseProductType = {
  name: LangTextType,
  shortDescription: LangTextType,
  longDescription: LangTextType,
  seoTitle: LangTextType,
  seoDescription: LangTextType,
  category: {
    rawId: number,
  },
};

type PropsType = {
  baseProduct: ?BaseProductType,
  onSave: Function,
  validationErrors: ?{},
  categories: Array<{}>,
  isLoading: boolean,
};

type StateType = {
  form: {
    name: string,
    shortDescription: string,
    longDescription: string,
    seoTitle: string,
    seoDescription: string,
    categoryId: ?number,
  },
  formErrors: {
    [string]: Array<string>,
  },
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { baseProduct } = this.props;
    let form = {};
    if (baseProduct) {
      form = {
        name: getNameText(baseProduct.name || [], 'EN') || '',
        shortDescription:
          getNameText(baseProduct.shortDescription || [], 'EN') || '',
        longDescription:
          getNameText(baseProduct.longDescription || [], 'EN') || '',
        seoTitle: getNameText(baseProduct.seoTitle || [], 'EN') || '',
        seoDescription:
          getNameText(baseProduct.seoDescription || [], 'EN') || '',
        categoryId: baseProduct.category.rawId,
      };
    } else {
      form = {
        name: '',
        shortDescription: '',
        longDescription: '',
        seoTitle: '',
        seoDescription: '',
        categoryId: null,
      };
    }
    this.state = {
      form,
      formErrors: {},
    };
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const currentFormErrors = this.state.formErrors;
    const nextFormErrors = nextProps.validationErrors;
    if (isEmpty(currentFormErrors) && !isEmpty(nextFormErrors)) {
      const formErrors = renameKeys(
        {
          long_description: 'longDescription',
          short_description: 'shortDescription',
          seo_title: 'seoTitle',
          seo_description: 'seoDescription',
        },
        nextFormErrors,
      );
      this.setState({ formErrors });
    }
  }

  validate = () => {
    // TODO: вынести спеки
    const { errors } = validate(
      {
        name: [[val => !isEmpty(val), 'Name must not be empty']],
        shortDescription: [
          [val => !isEmpty(val), 'Short description must not be empty'],
        ],
        longDescription: [
          [val => !isEmpty(val), 'Long description must not be empty'],
        ],
      },
      this.state.form,
    );
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
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState((prevState: StateType) =>
        assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
      );
    }
  };

  handleTextareaChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
    );
  };

  renderInput = (props: { id: string, label: string, limit: number }) => {
    const { id, label, limit } = props;
    return (
      <Input
        id={id}
        value={prop(id, this.state.form) || ''}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        limit={limit}
      />
    );
  };

  renderTextarea = (props: { id: string, label: string }) => {
    const { id, label } = props;
    return (
      <Textarea
        id={id}
        value={prop(id, this.state.form) || ''}
        label={label}
        onChange={this.handleTextareaChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    );
  };

  render() {
    const { isLoading, baseProduct } = this.props;
    return (
      <div styleName="container">
        <div styleName="form">
          <div styleName="title">
            <strong>General characteristics</strong>
          </div>
          <div styleName="formItem">
            {this.renderInput({ id: 'name', label: 'Product name', limit: 50 })}
          </div>
          <div styleName="formItem">
            {this.renderInput({
              id: 'seoTitle',
              label: 'SEO title',
              limit: 50,
            })}
          </div>
          <div styleName="formItem">
            {this.renderTextarea({
              id: 'seoDescription',
              label: 'SEO description',
            })}
          </div>
          <div styleName="formItem">
            {this.renderTextarea({
              id: 'shortDescription',
              label: 'Short description',
            })}
          </div>
          <div styleName="formItem">
            {this.renderTextarea({
              id: 'longDescription',
              label: 'Long description',
            })}
          </div>
          <div styleName="formItem">
            <CategorySelector
              categories={this.props.categories}
              category={baseProduct && baseProduct.category}
              onSelect={itemId => {
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
              big
              onClick={this.handleSave}
              isLoading={isLoading}
              dataTest="saveProductButton"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

// $FlowIgnoreMe
export default withErrorBoundary(Form);
