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
  omit,
} from 'ramda';
import { validate } from '@storiqa/shared';

import { currentUserShape } from 'utils/shapes';
import { SpinnerButton } from 'components/common/SpinnerButton';
import { Select } from 'components/common/Select';
import { Textarea } from 'components/common/Textarea';
import { Input } from 'components/common/Input';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';

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
  isLoading: boolean,
  store?: {
    name?: Array<{ lang: string, text: string }>,
    longDescription?: Array<{ lang: string, text: string }>,
    defaultLanguage: ?string,
    slug: ?string,
    slogan: ?string,
  },
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
          // $FlowIgnoreMe
          name: pathOr('', ['name', 0, 'text'], store),
          // $FlowIgnoreMe
          longDescription: pathOr('', ['longDescription', 0, 'text'], store),
          // $FlowIgnoreMe
          shortDescription: pathOr('', ['shortDescription', 0, 'text'], store),
          defaultLanguage: store.defaultLanguage || 'EN',
          slug: store.slug || '',
          slogan: store.slogan || '',
        },
        langItems: null,
        optionLanguage: 'EN',
        formErrors: {},
      };
    }
  }

  state: StateType = {
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
    const {
      directories: { languages },
    } = this.context;
    const langItems = map(
      item => ({
        id: item.isoCode,
        label: languagesDic[item.isoCode],
      }),
      languages,
    );
    this.setState({ langItems });
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const currentFormErrors = this.state.formErrors;
    const nextFormErrors = nextProps.serverValidationErrors;
    if (isEmpty(currentFormErrors) && !isEmpty(nextFormErrors)) {
      this.setState({ formErrors: nextFormErrors });
    }
  }

  handleDefaultLanguage = (defaultLanguage: { id: string, label: string }) => {
    this.setState(
      assocPath(['form', 'defaultLanguage'], toUpper(defaultLanguage.id)),
    );
  };

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState((prevState: StateType) =>
        assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
      );
    }
  };

  handleTextareaChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
    );
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
    const { errors: formErrors } = validate(
      {
        name: [
          [(value: string) => value && value.length > 0, 'Should not be empty'],
        ],
        shortDescription: [
          [(value: string) => value && value.length > 0, 'Should not be empty'],
        ],
        longDescription: [
          [(value: string) => value && value.length > 0, 'Should not be empty'],
        ],
        slug: [
          [(value: string) => value && value.length > 0, 'Should not be empty'],
        ],
      },
      {
        name,
        longDescription,
        shortDescription,
        slug,
      },
    );

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

  renderTextarea = ({ id, label }: { [string]: any }) => (
    <div styleName="formItem">
      <Textarea
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleTextareaChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  render() {
    const {
      langItems,
      form: { defaultLanguage },
    } = this.state;
    const { isLoading } = this.props;
    const defaultLanguageValue = find(
      propEq('id', toLower(defaultLanguage || '')),
      langItems || [],
    );

    return (
      <Fragment>
        <Header title="Settings" />
        <div styleName="form">
          {this.renderInput({
            id: 'name',
            label: 'Store name',
            limit: 50,
          })}
          <div styleName="formItem">
            <Select
              forForm
              label="Language"
              activeItem={defaultLanguageValue}
              items={langItems}
              onSelect={this.handleDefaultLanguage}
              tabIndexValue={0}
              dataTest="storeLangSelect"
            />
          </div>
          {this.renderInput({
            id: 'slogan',
            label: 'Slogan',
            limit: 50,
          })}
          {this.renderInput({
            id: 'slug',
            label: 'Slug',
            limit: 50,
          })}
          {this.renderTextarea({
            id: 'shortDescription',
            label: 'Short description',
          })}
          {this.renderTextarea({
            id: 'longDescription',
            label: 'Long description',
          })}
          <div styleName="formItem">
            <SpinnerButton
              onClick={this.handleSave}
              isLoading={isLoading}
              dataTest="saveButton"
            >
              Save
            </SpinnerButton>
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

// $FlowIgnoreMe
export default withErrorBoundary(Form);
