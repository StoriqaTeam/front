// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, propOr, pick } from 'ramda';
import { createFragmentContainer, graphql } from 'react-relay';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { Input } from 'components/Forms';
import { Button } from 'components/Button';
import { UpdateStoreMutation } from 'relay/mutations';
import { log, fromRelayError } from 'utils';

import Header from './Header';
import Menu from './Menu';

import './Contacts.scss';

type PropsType = {
  me: { store: { rawId: string, id: string } },
};

type StateType = {
  form: {
    email: ?string,
    phone: ?string,
    address: ?string,
    facebookUrl: ?string,
    instagramUrl: ?string,
    twitterUrl: ?string,
  },
  formErrors: {
    [string]: ?any,
  },
  activeItem: string,
};

class Contacts extends Component<PropsType, StateType> {
  state = {
    form: {
      email: '',
      phone: '',
      address: '',
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
    },
    formErrors: {},
    activeItem: 'contacts',
  };

  componentWillMount() {
    const store = pathOr({}, ['me', 'store'], this.props);
    this.setState({
      form: pick([
        'email',
        'phone',
        'address',
        'facebookUrl',
        'instagramUrl',
        'twitterUrl',
      ], store),
    });
  }

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  handleUpdate = () => {
    const { currentUser, environment } = this.context;
    const { me: { store } } = this.props;
    if (!currentUser || !currentUser.rawId) {
      return;
    }

    const {
      form: {
        email,
        phone,
        address,
        facebookUrl,
        twitterUrl,
        instagramUrl,
      },
    } = this.state;

    this.setState({ formErrors: {} });

    UpdateStoreMutation.commit({
      userId: parseInt(currentUser.rawId, 10),
      rawId: store.rawId,
      id: store.id,
      email,
      phone,
      address,
      facebookUrl,
      twitterUrl,
      instagramUrl,
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

        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
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
  renderInput = (id: string, label: string, icon?: string) => (
    <div styleName="formItem">
      <Input
        isUrl={Boolean(icon)}
        icon={icon}
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={propOr(null, id, this.state.formErrors)}
      />
    </div>
  );

  render() {
    const { activeItem } = this.state;

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
              <Header title="Контакты" />
              <div styleName="form">
                {this.renderInput('email', 'Email')}
                {this.renderInput('phone', 'Phone')}
                {this.renderInput('facebookUrl', 'Facebook', 'facebook')}
                {this.renderInput('instagramUrl', 'Instagram', 'instagram')}
                {this.renderInput('twitterUrl', 'Twitter', 'twitter')}
                {this.renderInput('address', 'Address')}
                <div styleName="formItem">
                  <Row>
                    <Col size={4}>
                      {this.renderInput('city', 'City')}
                    </Col>
                    <Col size={4}>
                      {this.renderInput('state', 'State / Province / Region')}
                    </Col>
                  </Row>
                </div>
                <div styleName="formItem">
                  <Row>
                    <Col size={4}>
                      {this.renderInput('zip', 'ZIP / Postal code')}
                    </Col>
                    <Col size={4}>
                      {this.renderInput('country', 'Country')}
                    </Col>
                  </Row>
                </div>
                <div styleName="formItem">
                  <Button
                    type="button"
                    onClick={this.handleUpdate}
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

Contacts.contextTypes = {
  environment: PropTypes.object.isRequired,
  currentUser: currentUserShape,
};

export default createFragmentContainer(
  Page(Contacts),
  graphql`
    fragment Contacts_me on User
    @argumentDefinitions(storeId: { type: "ID!" }) {
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
        address
      }
    }
  `,
);
