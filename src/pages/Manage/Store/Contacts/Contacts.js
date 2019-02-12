// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, propOr, pick, isEmpty } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';
import uuidv4 from 'uuid/v4';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Button, Input } from 'components/common';
import { AddressForm } from 'components/AddressAutocomplete';
import ModerationStatus from 'pages/common/ModerationStatus';
import { UpdateStoreMutation, UpdateStoreMainMutation } from 'relay/mutations';
import { log, fromRelayError } from 'utils';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { MutationParamsType } from 'relay/mutations/UpdateStoreMutation';
import type { Contacts_me as ContactsMeType } from './__generated__/Contacts_me.graphql';

import './Contacts.scss';

import t from './i18n';

type NestedObject<T> = { [k: string]: T | NestedObject<T> };

type addressFullType = {
  value?: ?string,
  country?: ?string,
  countryCode: ?string,
  administrativeAreaLevel1?: ?string,
  administrativeAreaLevel2?: ?string,
  locality?: ?string,
  political?: ?string,
  postalCode?: ?string,
  route?: ?string,
  streetNumber?: ?string,
  placeId?: ?string,
};

type InputType = {
  id: string,
  label: string,
  icon?: string,
  limit?: number,
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  me: ContactsMeType,
};

type StateType = {
  form: {
    email: ?string,
    phone: ?string,
    facebookUrl: ?string,
    instagramUrl: ?string,
    twitterUrl: ?string,
    cover: ?string,
  },
  addressFull: addressFullType,
  formErrors: {
    [string]: Array<string>,
  },
  isLoading: boolean,
  logoUrl?: string,
};

class Contacts extends Component<PropsType, StateType> {
  state: StateType = {
    form: {
      email: '',
      phone: '',
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      cover: '',
    },
    addressFull: {
      value: '',
      country: '',
      countryCode: null,
      administrativeAreaLevel1: '',
      administrativeAreaLevel2: '',
      locality: '',
      political: '',
      postalCode: '',
      route: '',
      streetNumber: '',
      placeId: '',
    },
    formErrors: {},
    isLoading: false,
  };

  componentWillMount() {
    // $FlowIgnoreMe
    const store = pathOr({}, ['myStore'], this.props.me);
    this.setState({
      form: pick(
        [
          'email',
          'phone',
          'facebookUrl',
          'instagramUrl',
          'twitterUrl',
          'cover',
        ],
        store,
      ),
      addressFull: store.addressFull,
    });
  }

  handleInputChange = (id: string) => (
    e: SyntheticInputEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    const val = id === 'phone' ? value.replace(/\s/g, '') : value;
    this.setState(assocPath(['form', id], val, this.state));
  };

  handleUpdateForm = (form: { address: string }) => {
    this.setState(
      assocPath(['addressFull', 'value'], form.address, this.state),
    );
  };

  handleChangeData = (addressFullData: addressFullType): void => {
    this.setState(() => ({
      addressFull: {
        ...this.state.addressFull,
        ...addressFullData,
      },
    }));
  };

  handleLogoUpload = (url: string) => {
    const { environment } = this.context;
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['me', 'myStore', 'id'], this.props);

    UpdateStoreMainMutation.commit({
      id: storeId,
      logo: url,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.saved,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    });
  };

  handleUpdate = () => {
    const { currentUser, environment } = this.context;
    const {
      me: { myStore },
    } = this.props;
    if (!currentUser || !currentUser.rawId || !myStore || !myStore.id) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingGoingWrong,
        link: { text: t.close },
      });
      return;
    }

    const {
      logoUrl,
      // param 'country' enter for 'this.handleUpdateForm'
      form: { email, phone, facebookUrl, twitterUrl, instagramUrl, cover },
      addressFull,
    } = this.state;

    this.setState({ formErrors: {}, isLoading: true });

    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        id: myStore.id || '',
        logo: logoUrl,
        email,
        phone,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        addressFull,
        cover,
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);

        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.saved,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({ formErrors: validationErrors });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }

        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    UpdateStoreMutation.commit(params);
  };

  isSaveAvailable = () => {
    // $FlowIgnoreMe
    const status = pathOr(null, ['me', 'myStore', 'status'], this.props);
    return status === 'DRAFT' || status === 'DECLINE' || status === 'PUBLISHED';
  };

  // TODO: extract to helper
  renderInput = (input: InputType) => {
    const { id, label, icon, limit } = input;
    return (
      <div styleName="formItem">
        <Input
          isUrl={Boolean(icon)}
          icon={icon}
          id={id}
          value={propOr('', id, this.state.form) || ''}
          label={label}
          onChange={this.handleInputChange(id)}
          errors={propOr(null, id, this.state.formErrors)}
          limit={limit}
          fullWidth
        />
      </div>
    );
  };

  render() {
    // $FlowIgnoreMe
    const status = pathOr(null, ['me', 'myStore', 'status'], this.props);
    const { isLoading, addressFull } = this.state;
    return (
      <div styleName="container">
        <div styleName="form">
          {status && (
            <div styleName="storeStatus">
              <ModerationStatus
                status={status}
                dataTest={`storeStatus_${status}`}
              />
            </div>
          )}
          <div styleName="wrap">
            {this.renderInput({ id: 'email', label: t.labelEmail, limit: 50 })}
            {this.renderInput({ id: 'phone', label: t.labelPhone })}
            {this.renderInput({
              id: 'facebookUrl',
              label: 'Facebook',
              icon: 'facebook',
            })}
            {this.renderInput({
              id: 'instagramUrl',
              label: 'Instagram',
              icon: 'instagram',
            })}
            {this.renderInput({
              id: 'twitterUrl',
              label: 'Twitter',
              icon: 'twitter',
            })}
            <div styleName="formItem">
              <div styleName="address">
                <AddressForm
                  country={addressFull.country}
                  address={addressFull.value}
                  addressFull={addressFull}
                  onChangeData={this.handleChangeData}
                />
              </div>
            </div>
          </div>
          <div styleName="buttonsPanel">
            <div styleName="saveButton">
              <Button
                big
                fullWidth
                onClick={this.handleUpdate}
                isLoading={isLoading}
                disabled={!this.isSaveAvailable()}
              >
                {t.save}
              </Button>
            </div>
            {status &&
              status === 'MODERATION' && (
                <div styleName="warnMessage">{t.storeIsOnModeration}</div>
              )}
            {status &&
              status === 'BLOCKED' && (
                <div styleName="warnMessage">{t.storeIsBlocked}</div>
              )}
          </div>
        </div>
      </div>
    );
  }
}

Contacts.contextTypes = {
  environment: PropTypes.object.isRequired,
  currentUser: currentUserShape,
};

export default createFragmentContainer(
  withShowAlert(
    Page(
      ManageStore({
        OriginalComponent: Contacts,
        active: 'contacts',
        title: 'Contacts',
      }),
    ),
  ),
  graphql`
    fragment Contacts_me on User {
      myStore {
        id
        rawId
        status
        name {
          lang
          text
        }
        logo
        cover
        email
        phone
        facebookUrl
        twitterUrl
        instagramUrl
        addressFull {
          value
          country
          administrativeAreaLevel1
          administrativeAreaLevel2
          locality
          political
          postalCode
          route
          streetNumber
          placeId
        }
      }
    }
  `,
);
