// @flow

import React from 'react';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';

import './Form.scss';

type DataType = {
  name: ?string,
  shortDescription: ?string,
  slug: ?string,
  defaultLanguage: ?string,
};

type PropsType = {
  data: DataType,
  onChange: (fieldName: string, value: string) => void,
};

type StateType = DataType;

class FirstForm extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    console.log('*** Frist form const props: ', props)
    this.state = {
      name: props.data ? props.data.name : '',
      slug: props.data ? props.data.slug : '',
      shortDescription: props.data ? props.data.shortDescription : '',
      defaultLanguage: props.data ? props.data.defaultLanguage : '',
    }
  }

  handleOnChange = e => {
    const { onChange } = this.props;
    const {
      target: { value, name },
    } = e;
    this.setState({ [name]: value });
    onChange({ ...this.state });
  };

  handleOnSave = () => {
    const { onChange } = this.props;
    // onChange({ ...this.state });
  };

  render() {
    // const { data } = this.props;
    const { name, slug, shortDescription } = this.state;
    return (
      <div styleName="form">
        <div styleName="formItem">
          <Input
            id="name"
            value={name}
            label="Name"
            onChange={this.handleOnChange}
            onBlur={this.handleOnSave}
            fullWidth
          />
        </div>
        <div styleName="formItem">
          <Input
            id="slug"
            value={slug}
            label="Slug"
            onChange={this.handleOnChange}
            onBlur={this.handleOnSave}
            fullWidth
          />
        </div>
        <div>
          <Textarea
            id="shortDescription"
            value={shortDescription}
            label="Short description"
            onChange={this.handleOnChange}
            onBlur={this.handleOnSave}
            fullWidth
          />
        </div>
      </div>
    );
  }
};

export default FirstForm;
