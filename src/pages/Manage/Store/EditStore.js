// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, propOr, map, toString, toUpper } from 'ramda';
import { validate } from '@storiqa/validation_specs';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { MiniSelect } from 'components/MiniSelect';
import { Input, Dropdown } from 'components/Forms';
import { CreateStoreMutation } from 'relay/mutations';
import { Button } from 'components/Button';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';

import './EditStore.scss';

type PropsType = {
  //
};

type StateType = {
  form: {
    [string]: ?any,
  },
  formErrors: {
    [string]: ?any,
  },
};

// TODO: extract to shared lib
const languagesDic = {
  en: 'en',
  ch: 'ch',
  de: 'de',
  ru: 'ru',
  es: 'es',
  fr: 'fr',
  ko: 'ko',
  po: 'po',
  ja: 'ja',
};

// TODO: extract to shared lib
const currenciesDic = {
  rouble: 'RUB',
  euro: 'EUR',
  dollar: 'USD',
  bitcoin: 'BTC',
  etherium: 'ETH',
  stq: 'STQ',
};

class EditStore extends Component<PropsType, StateType> {
  state: StateType = {
    form: {},
    formErrors: {},
  };

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  handleSave = () => {
    const { currentUser, environment } = this.context;
    if (!currentUser || !currentUser.rawId) {
      return;
    }

    const {
      form: {
        name,
        currencyId,
        defaultLanguage,
        longDescription,
        shortDescription,
        slug,
        slogan,
      },
    } = this.state;

    // TODO: вынести в либу спеки
    const { errors: formErrors } = validate({
      name: [[(value: string) => value && value.length > 0, 'Should not be empty']],
      shortDescription: [[(value: string) => value && value.length > 0, 'Should not be empty']],
      slug: [[(value: string) => value && value.length > 0, 'Should not be empty']],
    }, {
      name,
      currencyId,
      defaultLanguage,
      longDescription,
      shortDescription,
      slug,
      slogan,
    });
    if (formErrors) {
      this.setState({ formErrors });
      return;
    }

    this.setState({ formErrors: {} });
    CreateStoreMutation.commit({
      userId: parseInt(currentUser.rawId, 10),
      name: [
        { lang: 'EN', text: name },
      ],
      currencyId: parseInt(currencyId, 10),
      defaultLanguage: toUpper(defaultLanguage),
      longDescription,
      shortDescription: [
        { lang: 'EN', text: shortDescription },
      ],
      slug,
      slogan,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        const validationErrors = pathOr(null, ['100', 'message'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }
        alert('Something going wrong :(');
      },
    });
  };

  // TODO: extract to helper
  capitalizeString = (s: string) => s && s[0] && s[0].toUpperCase() + s.slice(1);

  // TODO: extract to helper
  renderInput = (id: string, label: string) => (
    <div styleName="inputWrapper">
      <Input
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  render() {
    const { directories: { languages, currencies } } = this.context;
    const langItems = map(item => ({
      id: item.isoCode,
      label: languagesDic[item.isoCode],
    }), languages);
    const currencyItems = map(item => ({
      id: toString(item.key),
      label: currenciesDic[item.name],
    }), currencies);
    return (
      <Container>
        <Row>
          <Col size={2}>
            <div>menu</div>
          </Col>
          <Col size={10}>
            <div styleName="container">
              <div styleName="header">
                <span styleName="title">Настройки</span>
                <div styleName="langSelect">
                  <MiniSelect
                    items={langItems}
                    onSelect={(id: string) => {
                      log.debug({ id });
                    }}
                  />
                </div>
              </div>
              <div styleName="formContainer">
                {this.renderInput('name', 'Название магазина')}
                <div styleName="dropdownWrapper">
                  <Dropdown
                    label="Язык магазина"
                    items={langItems}
                    onSelect={this.handleInputChange('defaultLanguage')}
                  />
                </div>
                <div styleName="dropdownWrapper">
                  <Dropdown
                    label="Валюта магазина"
                    items={currencyItems}
                    onSelect={this.handleInputChange('currencyId')}
                  />
                </div>
                {this.renderInput('slogan', 'Слоган магазина')}
                {this.renderInput('slug', 'Slug')}
                {this.renderInput('shortDescription', 'Краткое описание магазина')}
                {this.renderInput('longDescription', 'Полное описание магазина')}
                <Button
                  type="button"
                  onClick={this.handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

EditStore.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default Page(EditStore);
