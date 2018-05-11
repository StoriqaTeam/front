// @flow

import React, { Component, Fragment } from 'react';
import {
  assocPath,
  propOr,
  pathOr,
  map,
  toUpper,
  toLower,
  find,
  propEq,
  isEmpty,
  omit,
} from 'ramda';

import { Input } from 'components/common/Input';

import '../Profile.scss';

type PropsType = {
  //
};

type StateType = {
  formErrors: {
    [string]: ?any,
  },
};

class PersonalData extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    if (true) {
      this.state = {
        form: {
          // $FlowIgnoreMe
          //   name: pathOr('', ['name', 0, 'text'], store),
          //   name: pathOr('', ['name', 0, 'text'], store),
          //   // $FlowIgnoreMe
          //   longDescription: pathOr('', ['longDescription', 0, 'text'], store),
          //   // $FlowIgnoreMe
          //   shortDescription: pathOr('', ['shortDescription', 0, 'text'], store),
          //   defaultLanguage: store.defaultLanguage || 'EN',
          //   slug: store.slug || '',
          //   slogan: store.slogan || '',
        },
        formErrors: {},
      };
    }
  }

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    // if (value.length <= 50) {
    //   this.setState((prevState: StateType) =>
    //     assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
    //   );
    // }
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
    );
  };

  /* eslint-disable */
  renderInput = ({
    id,
    label,
    limit,
  }: {
    id: string,
    label: string,
    limit?: number,
  }) => (
    /* eslint-enable */
    <div styleName="formItem">
      <Input
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
        limit={limit}
      />
    </div>
  );

  render() {
    console.log('---this.props', this.props);
    return (
      <Fragment>
        {this.renderInput({
          id: 'firstName',
          label: 'First name',
        })}
        {this.renderInput({
          id: 'lastName',
          label: 'Last name',
        })}
      </Fragment>
    );
  }
}

export default PersonalData;
