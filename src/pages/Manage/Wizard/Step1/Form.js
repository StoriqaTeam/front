// @flow

import React from 'react';
import { evolve, pick, pathOr } from 'ramda';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';

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
  onChange: (fieldName: string, value: string) => void,
};

type StateType = DataType;

class FirstForm extends React.Component<PropsType, StateType> {
  static prepareState = (props: PropsType, state?: StateType) => {
    // const name = pathOr('', ['name'], props);
    // const shortDescription = pathOr('', ['shortDescription'], props);
    // const slug = pathOr('', ['slug'], props);
    console.log('>>> Form 1 prepareState: ', { props, state });
    const newState = {
      ...props,
      ...state,
      // name,
      // shortDescription,
      // slug,
    };
    console.log('<<< Form 1 prepareState: ', { newState });
    return newState;
  };

  // static getDerivedStateFromProps = (nextProps, prevState) => {
  //   const name = pathOr('', ['initialData', 'name', 'text'], nextProps);
  //   const shortDescription = pathOr('', ['initialData', 'shortDescription', 'text'], nextProps);
  //   const slug = pathOr('', ['initialData', 'slug'], nextProps);
  //   console.log('>>> Form 1 getDerivedStateFromProps: ', {name, slug, shortDescription});
  //   const newState = {
  //     ...prevState,
  //     name,
  //     shortDescription,
  //     slug,
  //     // ...pick(['name', 'slug', 'shortDescription', 'defaultLanguage'], nextProps),
  //   }
  //   console.log('<<< Form 1 getDerivedStateFromProps: ', { newState });
  //   return newState;
  // }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    return FirstForm.prepareState(nextProps.initialData, prevState);
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      ...props.initialData,
    };
  }

  transformToTranslations = (fieldName: string) => {
    const { initialData } = this.props;
    return text => [
      ...initialData[fieldName],
      {
        lang: 'EN',
        [fieldName]: text,
      },
    ];
  };

  // prepareInputData = () => {
  //   const transformations = {
  //     name: this.transformToTranslations('name'),
  //     shortDescription: this.transformToTranslations('shortDescription'),
  //   };
  //   return evolve(transformations, this.state);
  // }

  handleOnChange = e => {
    const { onChange } = this.props;
    const {
      target: { value, name },
    } = e;
    this.setState({ [name]: value }, () => {
      onChange({ ...this.state });
    });
  };

  handleOnChangeSlug = e => {
    const { onChange } = this.props;
    const {
      target: { value },
    } = e;
    this.setState({ slug: value }, () => {
      onChange({ ...this.state });
    });
  };

  // handleOnSave = () => {
  //   const { onChange } = this.props;
  //   // onChange({ ...this.state });
  // };

  render() {
    // const { data } = this.props;
    const { initialData } = this.props;
    const { name, slug, shortDescription } = this.state;
    console.log('>>> From 1 render: ', {
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
            label="Name"
            onChange={this.handleOnChange}
            // onBlur={this.handleOnSave}
            fullWidth
          />
        </div>
        <div styleName="formItem">
          <Input
            id="slug"
            value={slug}
            label="Slug"
            onChange={this.handleOnChangeSlug}
            // onBlur={this.handleOnSave}
            fullWidth
          />
        </div>
        <div>
          <Textarea
            id="shortDescription"
            value={shortDescription}
            label="Short description"
            onChange={this.handleOnChange}
            // onBlur={this.handleOnSave}
            fullWidth
          />
        </div>
      </div>
    );
  }
}

export default FirstForm;
