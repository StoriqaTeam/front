// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  assocPath,
  pathOr,
  propOr,
  map,
  toString,
  toUpper,
  toLower,
  find,
  propEq,
} from 'ramda';
import { validate } from '@storiqa/validation_specs';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { MiniSelect } from 'components/MiniSelect';
import { Input, Textarea } from 'components/Forms';
import { CreateStoreMutation } from 'relay/mutations';
import { Button } from 'components/Button';
import { Container, Row, Col } from 'layout';
import { log, fromRelayError } from 'utils';
import Header from './Header';
import Menu from './Menu';

import './EditStore.scss';

type StateType = {
  form: {
    name: string,
    currencyId: number,
    defaultLanguage: string,
    longDescription: string,
    shortDescription: string,
    slug: string,
    slogan: string,
  },
  formErrors: {
    [string]: ?any,
  },
  activeItem: string,
  langItems: ?Array<{ id: string, label: string }>,
  currencyItems: ?Array<{ id: string, label: string }>,
  optionLanguage: string,
};

// TODO: extract to shared lib
const languagesDic = {
  en: 'English',
  ch: 'Chinese',
  de: 'German',
  ru: 'Russian',
  es: 'Spanish',
  fr: 'French',
  ko: 'Korean',
  po: 'Portuguese',
  ja: 'Japanese',
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

class EditStore extends Component<{}, StateType> {
  state = {
    form: {
      name: '',
      longDescription: '',
      shortDescription: '',
      currencyId: 1,
      defaultLanguage: 'EN',
      slug: '',
      slogan: '',
    },
    activeItem: 'settings',
    langItems: null,
    currencyItems: null,
    optionLanguage: 'EN',
    formErrors: {},
  };

  componentWillMount() {
    const { directories: { languages, currencies } } = this.context;
    const langItems = map(item => ({
      id: item.isoCode,
      label: languagesDic[item.isoCode],
    }), languages);
    const currencyItems = map(item => ({
      id: toString(item.key),
      label: currenciesDic[item.name],
    }), currencies);

    this.setState({ langItems, currencyItems });
  }

  handleOptionLanguage = (optionLanguage: { id: string, label: string }) => {
    this.setState({ optionLanguage: toUpper(optionLanguage.id) });
  };

  handleDefaultLanguage = (defaultLanguage: { id: string, label: string }) => {
    this.setState(assocPath(['form', 'defaultLanguage'], toUpper(defaultLanguage.id)));
  };

  handleShopCurrency = (shopCurrency: { id: string, label: string }) => {
    this.setState(assocPath(['form', 'currencyId'], +shopCurrency.id));
  };

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  handleSave = () => {
    const { currentUser, environment } = this.context;
    const { optionLanguage } = this.state;

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
      longDescription: [[(value: string) => value && value.length > 0, 'Should not be empty']],
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
        { lang: optionLanguage, text: name },
      ],
      currencyId: parseInt(currencyId, 10),
      defaultLanguage: toUpper(defaultLanguage),
      longDescription: [
        { lang: optionLanguage, text: longDescription },
      ],
      shortDescription: [
        { lang: optionLanguage, text: shortDescription },
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
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }
        alert('Something going wrong :(');
      },
    });
  };

  switchMenu = (activeItem) => {
    this.setState({ activeItem });
  };

  // TODO: extract to helper
  capitalizeString = (s: string) => s && s[0] && s[0].toUpperCase() + s.slice(1);

  // TODO: extract to helper
  renderInput = (id: string, label: string) => (
    <div styleName="formItem">
      <Input
        forForm
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  renderTextarea = (id: string, label: string) => (
    <div styleName="formItem">
      <Textarea
        forForm
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  render() {
    const {
      activeItem,
      langItems,
      currencyItems,
      form,
      optionLanguage,
    } = this.state;

    const defaultLanguageValue = find(propEq('id', toLower(form.defaultLanguage)))(langItems);
    const optionLanguageValue = find(propEq('id', toLower(optionLanguage)))(langItems);
    const shopCurrencyValue = find(propEq('id', String(form.currencyId)))(currencyItems);

    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              activeItem={activeItem}
              switchMenu={this.switchMenu}
            />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Header title="Настройки">
                <div styleName="langSelect">
                  <MiniSelect
                    transparent
                    activeItem={optionLanguageValue}
                    items={langItems}
                    onSelect={this.handleOptionLanguage}
                  />
                </div>
              </Header>
              <div styleName="form">
                {this.renderInput('name', 'Название магазина')}
                <div styleName="formItem">
                  <MiniSelect
                    transparent
                    label="Язык магазина"
                    activeItem={defaultLanguageValue}
                    items={langItems}
                    onSelect={this.handleDefaultLanguage}
                  />
                </div>
                <div styleName="formItem">
                  <MiniSelect
                    transparent
                    label="Валюта магазина"
                    activeItem={shopCurrencyValue}
                    items={currencyItems}
                    onSelect={this.handleShopCurrency}
                  />
                </div>
                {this.renderInput('slogan', 'Слоган магазина')}
                {this.renderInput('slug', 'Slug')}
                {this.renderTextarea('shortDescription', 'Краткое описание магазина')}
                {this.renderTextarea('longDescription', 'Полное описание магазина')}
                <div styleName="formItem">
                  <Button
                    type="button"
                    onClick={this.handleSave}
                  >
                    Save
                  </Button>
                </div>
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
