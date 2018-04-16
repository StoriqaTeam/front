// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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
  complement,
} from 'ramda';
import { validate } from '@storiqa/shared';

import { currentUserShape } from 'utils/shapes';
import { Button } from 'components/common/Button';
import { Select } from 'components/common/Select';
import { Input, Textarea } from 'components/Forms';

import Header from './Header';

import './EditStore.scss';

type StateType = {
  form: {
    name: string,
    defaultLanguage: string,
    longDescription: string,
    shortDescription: string,
    slug: string,
    slogan: string,
  },
  formErrors: {
    [string]: ?any,
  },
  langItems: ?Array<{ id: string, label: string }>,
  optionLanguage: string,
};

type PropsType = {
  onSave: Function,
  store?: {},
  serverValidationErrors: {
    [string]: ?any,
  },
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

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { store } = props;
    if (store) {
      this.state = {
        form: {
          name: pathOr(null, ['name', 0, 'text'], store),
          longDescription: pathOr(null, ['longDescription', 0, 'text'], store),
          shortDescription: pathOr(null, ['shortDescription', 0, 'text'], store),
          defaultLanguage: pathOr(null, ['defaultLanguage'], store),
          slug: pathOr(null, ['slug'], store),
          slogan: pathOr(null, ['slogan'], store),
        },
        langItems: null,
        optionLanguage: 'EN',
        formErrors: {},
      };
    }
  }

  state = {
    form: {
      name: '',
      longDescription: '',
      shortDescription: '',
      defaultLanguage: 'EN',
      slug: '',
      slogan: '',
    },
    langItems: null,
    optionLanguage: 'EN',
    formErrors: {},
  };
  componentWillMount() {
    const { directories: { languages } } = this.context;
    const langItems = map(item => ({
      id: item.isoCode,
      label: languagesDic[item.isoCode],
    }), languages);
    this.setState({ langItems });
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const currentFormErrors = this.state.formErrors;
    const nextFormErrors = nextProps.serverValidationErrors;
    if (isEmpty(currentFormErrors) && complement(isEmpty(nextFormErrors))) {
      this.setState({ formErrors: nextFormErrors });
    }
  }

  handleDefaultLanguage = (defaultLanguage: { id: string, label: string }) => {
    this.setState(assocPath(['form', 'defaultLanguage'], toUpper(defaultLanguage.id)));
  };

  handleInputChange = (id: string) => (e: any) => {
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState(assocPath(['form', id], value.replace(/\s\s/, ' ')));
    }
  };

  handleSave = () => {
    const { currentUser } = this.context;
    const { optionLanguage } = this.state;

    if (!currentUser || !currentUser.rawId) {
      return;
    }

    const {
      form: {
        name,
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
      longDescription,
      shortDescription,
      slug,
    });

    if (formErrors) {
      this.setState({ formErrors });
      return;
    }

    this.setState({ formErrors: {} });
    this.props.onSave({
      form: {
        name,
        defaultLanguage,
        longDescription,
        shortDescription,
        slug,
        slogan,
      },
      optionLanguage,
    });
  };

  // TODO: extract to helper
  /* eslint-disable */
  renderInput = ({ id, label, limit }: { id: string, label: string, limit?: number }) => (
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

  renderTextarea = (id: string, label: string) => (
    <div styleName="formItem">
      <Textarea
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
      langItems,
      form,
    } = this.state;
    const defaultLanguageValue = find(propEq('id', toLower(form.defaultLanguage)))(langItems);

    return (
      <Fragment>
        <Header title="Settings" />
        <div styleName="form">
          {this.renderInput({ id: 'name', label: 'Store name', limit: 50 })}
          <div styleName="formItem">
            <Select
              forForm
              label="Язык магазина"
              activeItem={defaultLanguageValue}
              items={langItems}
              onSelect={this.handleDefaultLanguage}
            />
          </div>
          {this.renderInput({ id: 'slogan', label: 'Slogan', limit: 50 })}
          {this.renderInput({ id: 'slug', label: 'Slug', limit: 50 })}
          {this.renderInput({ id: 'shortDescription', label: 'Short description', limit: 50 })}
          {this.renderInput({ id: 'longDescription', label: 'Long description', limit: 50 })}
          <div styleName="formItem">
            <Button
              big
              type="button"
              onClick={this.handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

Form.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default Form;
