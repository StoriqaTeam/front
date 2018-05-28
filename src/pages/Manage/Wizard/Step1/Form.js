// @flow

import React from 'react';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { log } from 'utils';

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

type PropsType = {
  initialData: DataType,
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
    log.info('>>> Form 1 prepareState: ', { props, state });
    const newState = {
      ...props,
      ...state,
    };
    log.info('<<< Form 1 prepareState: ', { newState });
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
    const { initialData } = this.props;
    const { name, slug, shortDescription } = this.state;
    log.info('>>> From 1 render: ', {
      initialData,
      name,
      slug,
      shortDescription,
    });
    return (
      <div styleName="form">
        <div styleName="formItem">
          <Input
            id="name"
            value={name}
            label="Store name"
            onChange={this.handleOnChange}
            fullWidth
          />
        </div>
        <div styleName="formItem">
          <Input
            id="slug"
            value={slug}
            label="Slug"
            onChange={this.handleOnChange}
            fullWidth
          />
        </div>
        <div>
          <Textarea
            id="shortDescription"
            value={shortDescription}
            label="Short description"
            onChange={this.handleOnChange}
            fullWidth
          />
        </div>
      </div>
    );
  }
}

export default FirstForm;
