// @flow

import React, { Component } from 'react';
import { assocPath, propOr } from 'ramda';

import { MiniSelect } from 'components/MiniSelect';
import { Input } from 'components/Forms';
import { log } from 'utils';

import './EditStore.scss';

type PropsType = {
  //
};

type StateType = {
  form: {
    [string]: ?any,
  },
};

class EditStore extends Component<PropsType, StateType> {
  state: StateType = {
    form: {},
  };

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  // TODO: extract to helper
  // TODO: add handling errors
  renderInput = (id: string, label: string) => (
    <Input
      id={id}
      value={propOr('', id, this.state.form)}
      label={label}
      onChange={this.handleInputChange(id)}
    />
  );

  render() {
    return (
      <div styleName="container">
        <div styleName="header">
          <span styleName="title">Настройки</span>
          <div styleName="langSelect">
            <MiniSelect
              items={[
                // FIXME: fill with actual data
                { id: '1', label: 'English' },
                { id: '2', label: 'Russian' },
                { id: '3', label: 'Chinese' },
              ]}
              onSelect={(id: string) => {
                log.debug({ id });
              }}
            />
          </div>
        </div>
        <div styleName="formContainer">
          {this.renderInput('name', 'Название магазина')}
          {/* Shop language */}
          {/* Currency */}
          {this.renderInput('tagline', 'Слоган магазина')}
          {this.renderInput('slug', 'Slug')}
          {this.renderInput('short_desc', 'Краткое описание магазина')}
          {this.renderInput('full_desc', 'Полное описание магазина')}
        </div>
      </div>
    );
  }
}

export default EditStore;
