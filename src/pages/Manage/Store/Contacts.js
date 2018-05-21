// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, propOr, pick } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { withShowAlert } from 'components/App/AlertContext';
import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { Input } from 'components/common/Input';
import { SpinnerButton } from 'components/common/SpinnerButton';
import { AddressForm } from 'components/AddressAutocomplete';
import { UpdateStoreMutation } from 'relay/mutations';
import { log, fromRelayError } from 'utils';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Header from './Header';
import Menu from './Menu';

import './Contacts.scss';

type NestedObject<T> = { [k: string]: T | NestedObject<T> };

/* eslint-disable */
type InputType = {
  id: string,
  label: string,
  icon?: string,
  limit?: number,
};
/* eslint-enable */

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
    country: ?string,
    address: ?string,
    facebookUrl: ?string,
    instagramUrl: ?string,
    twitterUrl: ?string,
  },
  formErrors: {
    [string]: ?any,
  },
  activeItem: string,
  isLoading: boolean,
};

class Contacts extends Component<PropsType, StateType> {
  state = {
    form: {
      email: '',
      phone: '',
      country: '',
      address: '',
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
    },
    formErrors: {},
    activeItem: 'contacts',
    isLoading: false,
  };

  componentWillMount() {
    // $FlowIgnoreMe
    const store = pathOr({}, ['store'], this.props.me);
    this.setState({
      form: pick(
        [
          'email',
          'phone',
          'country',
          'address',
          'facebookUrl',
          'instagramUrl',
          'twitterUrl',
        ],
        store,
      ),
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

  handleUpdateForm = (form: any) => {
    this.setState({
      form: {
        ...this.state.form,
        ...form,
      },
    });
  };

  handleUpdate = () => {
    const { currentUser, environment } = this.context;
    const {
      me: { store },
    } = this.props;
    if (!currentUser || !currentUser.rawId) {
      return;
    }

    const {
      // param 'country' enter for 'this.handleUpdateForm'
      form: {
        email,
        phone,
        address,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        country,
      },
    } = this.state;
    this.setState({ formErrors: {}, isLoading: true });

    UpdateStoreMutation.commit({
      userId: parseInt(currentUser.rawId, 10),
      rawId: store.rawId,
      id: store.id,
      email,
      phone,
      country,
      address,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));

        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));

        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({ formErrors: validationErrors });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          return;
        }

        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    });
  };

  switchMenu = activeItem => {
    this.setState({ activeItem });
  };

  // TODO: extract to helper
  renderInput = ({ id, label, icon, limit }: InputType) => (
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

  render() {
    const { activeItem, isLoading, form } = this.state;
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu activeItem={activeItem} switchMenu={this.switchMenu} />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Header title="Contacts" />
              <div styleName="form">
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
                  <AddressForm
                    country={form.country}
                    autocompleteValue={form.address}
                    onChangeFormInput={this.handleInputChange}
                    onUpdateForm={this.handleUpdateForm}
                  />
                </div>
                <div styleName="formItem">
                  <SpinnerButton
                    onClick={this.handleUpdate}
                    isLoading={isLoading}
                  >
                    Save
                  </SpinnerButton>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

Contacts.contextTypes = {
  environment: PropTypes.object.isRequired,
  currentUser: currentUserShape,
};

export default createFragmentContainer(
  withShowAlert(Page(Contacts)),
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
        email
        phone
        facebookUrl
        twitterUrl
        instagramUrl
        country
        address
        country
        addressFull {
          value
          country
        }
      }
    }
  `,
);
