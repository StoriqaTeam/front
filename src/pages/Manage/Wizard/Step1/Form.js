// @flow

import React from 'react';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';

import FormWrapper from '../FormWrapper';

import './Form.scss';

type TranslatedType = {
  lang?: string,
  text: string,
};

type DataType = {
  name: ?Array<TranslatedType>,
  shortDescription: ?Array<TranslatedType>,
  slug: ?string,
  defaultLanguage: ?string,
};

type ErrorsType = {
  [code: string]: Array<string>,
};

type PropsType = {
  initialData: DataType,
  errors: ?ErrorsType,
  onChange: ({
    id: string,
    rawId: number,
    stepOne: ?{},
    stepTwo: ?{},
    stepThree: ?{},
    store: {
      id: string,
      rawId: number,
      baseProducts: {
        edges: Array<?{}>,
      },
    },
  }) => void,
};

type StateType = DataType;

class FirstForm extends React.Component<PropsType, StateType> {
  static prepareState = (props: DataType, state?: StateType) => {
    const newState = {
      ...props,
      ...state,
    };
    return newState;
  };

  static getDerivedStateFromProps = (
    nextProps: PropsType,
    prevState: StateType,
  ) => FirstForm.prepareState(nextProps.initialData, prevState);

  constructor(props: PropsType) {
    super(props);
    this.state = {
      ...props.initialData,
    };
  }

  handleOnChange = (e: any) => {
    const { onChange } = this.props;
    const {
      target: { value, name },
    } = e;
    this.setState({ [name]: value }, () => {
      // $FlowIgnoreMe
      onChange({ ...this.state });
    });
  };

  render() {
    const { name, slug, shortDescription } = this.state;
    const { errors } = this.props;
    return (
      <FormWrapper
        firstForm
        title="Give your store a name"
        description="Make a bright name for your store to attend your customers and encrease your sales"
      >
        <div styleName="form">
          <div styleName="formItem">
            <Input
              id="name"
              value={name || ''}
              label={
                <span>
                  Store name <span styleName="red">*</span>
                </span>
              }
              onChange={this.handleOnChange}
              fullWidth
              errors={errors && errors.name}
            />
          </div>
          <div styleName="formItem">
            <Input
              id="slug"
              value={slug || ''}
              label={
                <span>
                  Slug <span styleName="red">*</span>
                </span>
              }
              onChange={this.handleOnChange}
              fullWidth
              errors={errors && errors.slug}
            />
          </div>
          <div>
            <Textarea
              id="shortDescription"
              value={shortDescription || ''}
              label={
                <span>
                  Short description <span styleName="red">*</span>
                </span>
              }
              onChange={this.handleOnChange}
              fullWidth
              errors={errors && errors.shortDescription}
            />
          </div>
        </div>
      </FormWrapper>
    );
  }
}

export default FirstForm;
