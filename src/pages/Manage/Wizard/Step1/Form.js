// @flow

import React from 'react';
import { pathOr } from 'ramda';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { InputSlug } from 'components/common/InputSlug';

import FormWrapper from '../FormWrapper';

import './Form.scss';

import t from './i18n';

type DataType = {
  name: string,
  shortDescription: ?string,
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

  handleOnChangeSlug = (slugValue: string) => {
    const { onChange } = this.props;
    this.setState({ slug: slugValue }, () => {
      // $FlowIgnoreMe
      onChange({ ...this.state });
    });
  };

  render() {
    const { name, shortDescription } = this.state;
    const { errors } = this.props;

    // $FlowIgnoreMe
    const slug = pathOr('', ['initialData', 'slug'], this.props);

    return (
      <FormWrapper
        firstForm
        title={t.giveYourStoreAname}
        description={t.makeAbrightName}
      >
        <div styleName="form">
          <div styleName="formItem">
            <Input
              id="name"
              value={name || ''}
              label={
                <span>
                  {t.storeName} <span styleName="red">*</span>
                </span>
              }
              onChange={this.handleOnChange}
              fullWidth
              errors={errors && errors.store}
            />
          </div>
          <div styleName="formItem">
            <InputSlug slug={slug} onChange={this.handleOnChangeSlug} />
          </div>
          <div>
            <Textarea
              id="shortDescription"
              value={shortDescription || ''}
              label={
                <span>
                  {t.shortDescription} <span styleName="red">*</span>
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
