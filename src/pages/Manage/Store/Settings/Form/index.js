// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  assocPath,
  find,
  isEmpty,
  map,
  omit,
  pathOr,
  propEq,
  propOr,
  toLower,
  toUpper,
  filter,
} from 'ramda';
import { validate } from '@storiqa/shared';

import { currentUserShape } from 'utils/shapes';
import { Button, Select, Textarea, Input, InputSlug } from 'components/common';
import { withErrorBoundary } from 'components/common/ErrorBoundaries';
import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { withShowAlert } from 'components/Alerts/AlertContext';
import ModerationStatus from 'pages/common/ModerationStatus';
import { RichEditor } from 'components/RichEditor';

import { uploadFile, convertSrc } from 'utils';

import type { ModerationStatusType } from 'types';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import './Form.scss';

import t from './i18n';

type StateType = {
  form: {
    rawId: number,
    name: string,
    defaultLanguage: string,
    longDescription: string,
    shortDescription: string,
    slug: string,
    cover: string,
    slogan: string,
  },
  formErrors: {
    [string]: ?any,
  },
  langItems: ?Array<{ id: string, label: string }>,
  optionLanguage: string,
  status: ?ModerationStatusType,
  isMainPhotoUploading: boolean,
};

type PropsType = {
  onSave: Function,
  isLoading: boolean,
  store?: {
    rawId: number,
    name?: Array<{ lang: string, text: string }>,
    longDescription?: Array<{ lang: string, text: string }>,
    defaultLanguage: ?string,
    slug: ?string,
    slogan: ?string,
    cover: ?string,
    status: ModerationStatusType,
  },
  serverValidationErrors: {
    [string]: ?any,
  },
  handleNewStoreNameChange: (value: string) => void,
  showAlert: (input: AddAlertInputType) => void,
  onClickOnSendToModeration: () => void,
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
          // $FlowIgnore
          name: pathOr('', ['name', 0, 'text'])(store),
          // $FlowIgnore
          longDescription: pathOr('', ['longDescription', 0, 'text'])(store),
          // $FlowIgnore
          shortDescription: pathOr('', ['shortDescription', 0, 'text'])(store),
          defaultLanguage: store.defaultLanguage || 'EN',
          slug: store.slug || '',
          cover: store.cover || '',
          slogan: store.slogan || '',
          rawId: store.rawId,
        },
        langItems: null,
        optionLanguage: 'EN',
        formErrors: {},
        isMainPhotoUploading: false,
        status: store.status,
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
      cover: '',
      slogan: '',
      rawId: -1,
    },
    langItems: null,
    optionLanguage: 'EN',
    formErrors: {},
    isMainPhotoUploading: false,
    status: null,
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
      filter(item => item.isoCode === 'en', languages),
    );
    this.setState({ langItems });
  }

  componentWillReceiveProps(nextProps: PropsType) {
    const currentFormErrors = this.state.formErrors;
    const nextFormErrors = nextProps.serverValidationErrors;
    if (isEmpty(currentFormErrors) && !isEmpty(nextFormErrors)) {
      this.setState({ formErrors: nextFormErrors });
    } else if (nextProps.store) {
      this.setState({ status: nextProps.store.status });
    }
  }

  handleDefaultLanguage = (defaultLanguage: {
    id: string,
    label: string,
  }): void => {
    this.setState(
      assocPath(['form', 'defaultLanguage'], toUpper(defaultLanguage.id)),
    );
  };

  handleInputChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value, prevState),
    );
    if (this.props.handleNewStoreNameChange && id === 'name') {
      this.props.handleNewStoreNameChange(value);
    }
  };

  handleTextareaChange = (id: string) => (e: any) => {
    this.setState({ formErrors: omit([id], this.state.formErrors) });
    const { value } = e.target;
    this.setState((prevState: StateType) =>
      assocPath(['form', id], value, prevState),
    );
  };

  handleSave = () => {
    if (!this.isSaveAvailable()) {
      return;
    }

    const { currentUser } = this.context;
    const { optionLanguage } = this.state;

    if (!currentUser || !currentUser.rawId) {
      return;
    }

    const {
      form: {
        rawId,
        name,
        defaultLanguage,
        longDescription,
        shortDescription,
        slug,
        cover,
        slogan,
      },
      status,
    } = this.state;

    // TODO: вынести в либу спеки
    const { errors: formErrors } = validate(
      {
        name: [
          [(value: string) => value && value.length > 0, t.nameMustNotBeEmpty],
        ],
        shortDescription: [
          [
            (value: string) => value && value.length > 0,
            t.shortDescriptionMustNotBeEmpty,
          ],
        ],
        longDescription: [
          [
            (value: string) => value && value.length > 0,
            t.longDescriptionMustNotBeEmpty,
          ],
        ],
        slug: [
          [(value: string) => value && value.length > 0, t.slugMustNotBeEmpty],
        ],
      },
      {
        name,
        longDescription,
        shortDescription,
        cover,
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
        rawId,
        name,
        defaultLanguage,
        longDescription,
        shortDescription,
        slug,
        cover,
        slogan,
      },
      optionLanguage,
      status,
    });
  };

  handleOnUpload = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!this.isSaveAvailable()) {
      return;
    }

    this.setState({ isMainPhotoUploading: true });
    uploadFile(e.target.files[0])
      .then(result => {
        if (!result || result.url == null) {
          alert('Error :('); // eslint-disable-line
        }
        this.setState(assocPath(['form', 'cover'], result.url, this.state));
        return true;
      })
      .finally(() => {
        this.setState({ isMainPhotoUploading: false });
      })
      .catch(error => {
        this.props.showAlert({
          type: 'danger',
          text: error.message,
          link: { text: t.close },
        });
      });
  };

  handleError = (error: { message: string }): void => {
    const { showAlert } = this.props;
    showAlert({
      type: 'danger',
      text: error.message,
      link: { text: t.close },
    });
  };

  handleDeleteCover = () => {
    this.setState(assocPath(['form', 'cover'], '', this.state));
  };

  handleLongDescription = longDescription => {
    const { form } = this.state;
    this.setState({
      form: {
        ...form,
        longDescription,
      },
      formErrors: omit(['longDescription'], this.state.formErrors),
    });
  };

  writeSlug = (slugValue: string) => {
    this.setState((prevState: StateType) =>
      assocPath(['form', 'slug'], slugValue, prevState),
    );
  };

  // TODO: extract to helper
  /* eslint-disable */
  renderInput = ({
    id,
    label,
    limit,
    required,
  }: {
    id: string,
    label: string,
    limit?: number,
    required?: boolean,
  }) => {
    const hereLabel = required ? (
      <span>
        {label} <span styleName="asterisk">*</span>
      </span>
    ) : (
      label
    );
    return (
      <div styleName="formItem maxWidthInput">
        <Input
          id={id}
          // $FlowIgnoreMe
          value={propOr('', id, this.state.form)}
          label={hereLabel}
          onChange={this.handleInputChange(id)}
          errors={propOr(null, id, this.state.formErrors)}
          limit={limit}
          fullWidth
        />
      </div>
    );
  };

  renderTextarea = ({
    id,
    label,
    limit,
    required,
  }: {
    id: string,
    label: string,
    limit?: number,
    required?: boolean,
  }) => {
    const hereLabel = required ? (
      <span>
        {label} <span styleName="asterisk">*</span>
      </span>
    ) : (
      label
    );
    return (
      <div styleName="formItem maxWidthTextArea">
        <Textarea
          id={id}
          // $FlowIgnoreMe
          value={propOr('', id, this.state.form)}
          label={hereLabel}
          onChange={this.handleTextareaChange(id)}
          errors={propOr(null, id, this.state.formErrors)}
          limit={limit}
          fullWidth
        />
      </div>
    );
  };

  isSaveAvailable = () =>
    this.state.status === 'DRAFT' ||
    this.state.status === 'DECLINE' ||
    this.state.status === 'PUBLISHED';

  isAbleSendToModeration = () => this.state.status === 'DRAFT';

  render() {
    const {
      langItems,
      form: { defaultLanguage, cover, slug },
      status,
    } = this.state;
    const { isLoading, store } = this.props;
    const defaultLanguageValue = find(
      propEq('id', toLower(defaultLanguage || '')),
      langItems || [],
    );
    // $FlowIgnore
    const realSlug = pathOr('', ['store', 'slug'], this.props);

    const longDescriptionError = propOr(
      null,
      'longDescription',
      this.state.formErrors,
    );
    return (
      <div styleName="container">
        <div styleName="form">
          {status && (
            <div styleName="storeStatus">
              <ModerationStatus
                status={status}
                dataTest={`storeStatus_${status}`}
                link={
                  process.env.REACT_APP_HOST && store && store.rawId
                    ? `${process.env.REACT_APP_HOST}/store/${store.rawId}`
                    : null
                }
              />
            </div>
          )}
          <div styleName="formHeader">
            {!cover ? (
              <div styleName="coverUploadWrap">
                <div styleName="uploadButton">
                  <UploadWrapper
                    id="cover-store"
                    onUpload={this.handleOnUpload}
                    customUnit
                    buttonHeight="10rem"
                    buttonWidth="100%"
                    buttonIconSize={32}
                    buttonIconType="upload"
                    dataTest="storeCoverUploader"
                    buttonLabel=""
                    loading={this.state.isMainPhotoUploading}
                  />
                </div>
                <div>
                  <div>{t.uploadMainPhoto}</div>
                  <div styleName="uploadRec">
                    {t.stronglyRecommendToUpload}
                    <br />
                    {t.size1360x350}
                  </div>
                </div>
              </div>
            ) : (
              <div styleName="cover">
                <button styleName="trash" onClick={this.handleDeleteCover}>
                  <Icon type="basket" size={28} />
                </button>
                <div styleName="image">
                  <img src={convertSrc(cover, 'medium')} alt="Store cover" />
                </div>
              </div>
            )}
          </div>
          {this.renderInput({
            id: 'name',
            label: t.labelStoreName,
            limit: 50,
            required: true,
          })}
          <div styleName="formItem maxWidthInput">
            {/* $FlowIgnoreMe */}
            <Select
              forForm
              label={t.labelLanguage}
              activeItem={defaultLanguageValue}
              items={langItems}
              onSelect={this.handleDefaultLanguage}
              tabIndexValue={0}
              dataTest="storeLangSelect"
              fullWidth
            />
          </div>
          {this.renderInput({
            id: 'slogan',
            label: t.labelSlogan,
            limit: 50,
          })}
          <div styleName="formItem maxWidthInput">
            <InputSlug
              slug={this.state.form.slug}
              realSlug={realSlug}
              onChange={this.writeSlug}
            />
          </div>
          {this.renderTextarea({
            id: 'shortDescription',
            label: t.labelShortDescription,
            limit: 170,
            required: true,
          })}

          <h3 styleName="title">
            <strong>{t.shopEditor}</strong>
          </h3>
          <RichEditor
            content={this.state.form.longDescription}
            onChange={this.handleLongDescription}
            onError={this.handleError}
          />
          {longDescriptionError && (
            <div styleName="error">{longDescriptionError}</div>
          )}
          <div styleName="buttonsPanel">
            <div styleName="saveButton">
              <Button
                big
                fullWidth
                onClick={this.handleSave}
                isLoading={isLoading}
                disabled={!slug || !this.isSaveAvailable()}
                dataTest="saveStoreButton"
              >
                {t.save}
              </Button>
            </div>
            {this.isAbleSendToModeration() && (
              <div styleName="moderationButton">
                <Button
                  big
                  fullWidth
                  onClick={this.props.onClickOnSendToModeration}
                  isLoading={isLoading}
                  disabled={!slug}
                  dataTest="sendToModerationStoreButton"
                >
                  {t.sendToModeration}
                </Button>
              </div>
            )}
            {this.state.status === 'MODERATION' && (
              <div styleName="warnMessage">{t.storeIsOnModeration}</div>
            )}
            {this.state.status === 'BLOCKED' && (
              <div styleName="warnMessage">{t.storeIsBlocked}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Form.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

// $FlowIgnoreMe
export default withErrorBoundary(withShowAlert(Form));
