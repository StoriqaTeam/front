// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, curry, reduce, assoc, keys, propOr, map } from 'ramda';

import { Button } from 'components/Button';
import { MiniSelect } from 'components/MiniSelect';
import { Input } from 'components/Forms';
import { Container, Row, Col } from 'layout';
import { Page } from 'components/App';
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
  };

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };


  // TODO: extract to helper
  /**
   * Creates a new object with the own properties of the provided object, but the
   * keys renamed according to the keysMap object as `{oldKey: newKey}`.
   * When some key is not found in the keysMap, then it's passed as-is.
   *
   * Keep in mind that in the case of keys conflict is behaviour undefined and
   * the result may vary between various JS engines!
   *
   * @sig {a: b} -> {a: *} -> {b: *}
   */
  renameKeys = curry((keysMap, obj) =>
    reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

  // TODO: extract to helper
  // TODO: add handling errors
  renderInput = (id: string, label: string, errors: ?Array<string>) => (
    <div styleName="inputWrapper">
      <Input
        id={id}
        value={propOr('', id, this.state.form)}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={errors}
      />
    </div>
  );

  render() {
    const { directories: { languages, currencies } } = this.context;
    return (
      <Container>
        <Row>
          <Col size={2}>
            <div>main</div>
          </Col>
          <Col size={10}>
            <div styleName="container">
              <div styleName="header">
                <span styleName="title">Настройки</span>
                <div styleName="langSelect">
                  <MiniSelect
                    items={map(this.renameKeys({ key: 'id', name: 'label' }), languages)}
                    onSelect={(id: string) => {
                      log.debug({ id });
                    }}
                  />
                </div>
              </div>
              <div styleName="formContainer">
                {this.renderInput('name', 'Название магазина')}
                <div styleName="selectWrapper">
                  <MiniSelect
                    items={map(this.renameKeys({ key: 'id', name: 'label' }), languages)}
                    onSelect={(id: string) => {
                      log.debug({ id });
                    }}
                    withTwoArrows
                  />
                </div>
                <div styleName="selectWrapper">
                  <MiniSelect
                    items={
                      map((item) => {
                        const withCorrectKeys = this.renameKeys({ key: 'id', name: 'label' })(item);
                        return assoc('label', currenciesDic[withCorrectKeys.label], withCorrectKeys);
                      }, currencies)
                    }
                    onSelect={(id: string) => {
                      log.debug({ id });
                    }}
                    withTwoArrows
                  />
                </div>
                {this.renderInput('tagline', 'Слоган магазина')}
                {this.renderInput('slug', 'Slug')}
                {this.renderInput('short_desc', 'Краткое описание магазина')}
                {this.renderInput('full_desc', 'Полное описание магазина')}
                <Button
                  type="button"
                  onClick={() => {}}
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
  directories: PropTypes.object,
};

export default Page(EditStore);
