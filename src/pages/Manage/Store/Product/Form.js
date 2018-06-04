// @flow

import React, { Component } from 'react';
import { assocPath, prop, propOr, isEmpty, pathOr, omit } from 'ramda';
import { validate } from '@storiqa/shared';

import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { SpinnerButton } from 'components/common/SpinnerButton';
import { CategorySelector } from 'components/CategorySelector';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { renameKeys } from 'utils/ramda';

import Header from '../Header';

import './Product.scss';

type PropsType = {
  baseProduct: ?{ [string]: any, shortDescription?: Array<any> },
  onSave: Function,
  validationErrors: ?{},
  categories: Array<{}>,
  isLoading: boolean,
};

type StateType = {
  form: {
    id?: any,
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
    if (!baseProduct) {
      return;
    }
    this.state = {
      form: {
        // $FlowIgnoreMe
        name: pathOr('', ['name', 0, 'text'], baseProduct),
        // $FlowIgnoreMe
        seoTitle: pathOr('', ['seoTitle', 0, 'text'], baseProduct),
        // $FlowIgnoreMe
        seoDescription: pathOr('', ['seoDescription', 0, 'text'], baseProduct),
        // $FlowIgnoreMe
        shortDescription: pathOr(
          '',
          ['shortDescription', 0, 'text'],
          baseProduct,
        ),
        // $FlowIgnoreMe
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
    if (isEmpty(currentFormErrors) && !isEmpty(nextFormErrors)) {
      // конвертнем имена с snakeCase в camel_case :)
      const formErrors = renameKeys(
        {
          long_description: 'fullDesc',
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
        fullDesc: [
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

  // eslint-disable-next-line
  renderInput = ({ id, label, limit, icon }: { [string]: any }) => (
    <div styleName="formItem">
      <Input
        isUrl={Boolean(icon)}
        icon={icon}
        id={id}
        value={prop(id, this.state.form) || ''}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        limit={limit}
      />
    </div>
  );

  renderTextarea = ({ id, label }: { [string]: any }) => (
    <div styleName="formItem">
      <Textarea
        id={id}
        value={prop(id, this.state.form) || ''}
        label={label}
        onChange={this.handleTextareaChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  render() {
    const { isLoading } = this.props;
    return (
      <div styleName="container">
        <Header title="Goods" />
        <div styleName="form">
          <div styleName="title">
            <strong>General characteristics</strong>
          </div>
          {this.renderInput({ id: 'name', label: 'Product name', limit: 50 })}
          {this.renderInput({ id: 'seoTitle', label: 'SEO title', limit: 50 })}
          {this.renderTextarea({
            id: 'seoDescription',
            label: 'SEO description',
          })}
          {this.renderTextarea({
            id: 'shortDescription',
            label: 'Short description',
          })}
          {this.renderTextarea({ id: 'fullDesc', label: 'Long description' })}
          <div styleName="formItem">
            <CategorySelector
              categories={this.props.categories}
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
            <SpinnerButton onClick={this.handleSave} isLoading={isLoading}>
              Save
            </SpinnerButton>
          </div>
        </div>
      </div>
    );
  }
}

// $FlowIgnoreMe
export default withErrorBoundary(Form);
