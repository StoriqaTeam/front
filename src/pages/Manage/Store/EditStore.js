// @flow

import React, { Component } from 'react';
import { assocPath } from 'ramda';

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
    this.setState(prevState => assocPath(['form', id], value, prevState));
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="header">
          <span styleName="title">Настройки</span>
          <div styleName="langSelect">
            <MiniSelect
              items={[
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
          <Input
            id="name"
            value={this.state.form.name || ''}
            label="Название магазина"
            onChange={this.handleInputChange('name')}
          />
          {/* Shop language */}
          {/* Currency */}
          <Input
            id="tagline"
            value={this.state.form.tagline || ''}
            label="Слоган магазина"
            onChange={this.handleInputChange('tagline')}
          />
          <Input
            id="slug"
            value={this.state.form.slug || ''}
            label="Slug"
            onChange={this.handleInputChange('slug')}
          />
          <Input
            id="short_desc"
            value={this.state.form.short_desc || ''}
            label="Краткое описание магазина"
            onChange={this.handleInputChange('short_desc')}
          />
          <Input
            id="full_desc"
            value={this.state.form.full_desc || ''}
            label="Полное описание магазина"
            onChange={this.handleInputChange('full_desc')}
          />
        </div>
      </div>
    );
  }
}

export default EditStore;
