// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, propOr, pick, isEmpty } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { withShowAlert } from 'components/App/AlertContext';
import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { Input } from 'components/common/Input';
import { SpinnerButton } from 'components/common/SpinnerButton';
import { AddressForm } from 'components/AddressAutocomplete';
import { UpdateStoreMutation, UpdateStoreMainMutation } from 'relay/mutations';
import { log, fromRelayError } from 'utils';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType } from 'relay/mutations/UpdateStoreMutation';

import './Contacts.scss';

type NestedObject<T> = { [k: string]: T | NestedObject<T> };

type addressFullType = {
  value?: ?string,
  country?: ?string,
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
  me: {
    store: { [string]: ?string },
  },
};

type StateType = {
  form: {
    email: ?string,
    phone: ?string,
    facebookUrl: ?string,
    instagramUrl: ?string,
    twitterUrl: ?string,
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
    },
    addressFull: {
      value: '',
      country: '',
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
    const store = pathOr({}, ['store'], this.props.me);
    // console.log('---store.addressFull', store.addressFull);
    this.setState({
      form: pick(
        ['email', 'phone', 'facebookUrl', 'instagramUrl', 'twitterUrl'],
        store,
      ),
      addressFull: store.addressFull,
    });
  }

  handleInputChange = (id: string) => (e: any) => {
    const { value } = e.target;
    if (value.length <= 50) {
      this.setState(
        assocPath(['form', id], value.replace(/\s\s/, ' '), this.state),
      );
    }
  };

  handleUpdateForm = (form: { address: string }) => {
    this.setState(
      assocPath(['addressFull', 'value'], form.address, this.state),
    );
  };

  handleChangeData = (addressFullData: addressFullType): void => {
    // console.log('---addressFullData', addressFullData);
    // this.setState({
    //   addressFull: {
    //     ...addressFullData,
    //   },
    // });

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
    const storeId = pathOr(null, ['me', 'store', 'id'], this.props);

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
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Saved!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    });
  };

  handleUpdate = () => {
    const { currentUser, environment } = this.context;
    const {
      me: { store },
    } = this.props;
    if (!currentUser || !currentUser.rawId || !store || !store.id) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong :(',
        link: { text: 'Close.' },
      });
      return;
    }

    const {
      logoUrl,
      // param 'country' enter for 'this.handleUpdateForm'
      form: { email, phone, facebookUrl, twitterUrl, instagramUrl },
      addressFull,
    } = this.state;

    this.setState({ formErrors: {}, isLoading: true });

    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        id: store.id || '',
        logo: logoUrl,
        email,
        phone,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        addressFull,
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
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Saved!',
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
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }

        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    };
    UpdateStoreMutation.commit(params);
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
          value={propOr('', id, this.state.form)}
          label={label}
          onChange={this.handleInputChange(id)}
          errors={propOr(null, id, this.state.formErrors)}
          limit={limit}
        />
      </div>
    );
  };

  render() {
    const { isLoading, addressFull } = this.state;
    // console.log('---country, address, addressFull', addressFull.country, addressFull.value, addressFull);

    return (
      <div styleName="container">
        {this.renderInput({ id: 'email', label: 'Email', limit: 50 })}
        {this.renderInput({ id: 'phone', label: 'Phone' })}
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
        <div styleName="formItem">
          <SpinnerButton onClick={this.handleUpdate} isLoading={isLoading}>
            Save
          </SpinnerButton>
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
  withShowAlert(Page(ManageStore(Contacts, 'Contacts'))),
  graphql`
    fragment Contacts_me on User
      @argumentDefinitions(storeId: { type: "Int!" }) {
      store(id: $storeId) {
        id
        rawId
        name {
          lang
          text
        }
        logo
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
