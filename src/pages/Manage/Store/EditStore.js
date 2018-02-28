// @flow

import React, { Component } from 'react';
import { assocPath, curry, reduce, assoc, keys, propOr } from 'ramda';

import { Button } from 'components/Button';
import { Input } from 'components/Forms';
import { Container, Row, Col } from 'layout';
import { Page } from 'components/App';
import Menu from './Menu';

import menuItems from './menuItems.json';

import './EditStore.scss';

type PropsType = {
  //
};

type StateType = {
  form: {
    [string]: ?any,
  },
  activeItem: string,
};

class EditStore extends Component<PropsType, StateType> {
  state: StateType = {
    form: {},
    activeItem: 'orders',
  };

  handleInputChange = (id: string) => (value: any) => {
    this.setState(assocPath(['form', id], value));
  };

  switchMenu = (activeItem) => {
    this.setState({ activeItem });
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
    const { activeItem } = this.state;
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu
              menuItems={menuItems}
              activeItem={activeItem}
              switchMenu={this.switchMenu}
            />
          </Col>
          <Col size={10}>
            {activeItem === 'settings' &&
              <div styleName="container">
                <div styleName="header">
                  <span styleName="title">Настройки</span>
                </div>
                <div styleName="formContainer">
                  {this.renderInput('name', 'Название магазина')}
                  {this.renderInput('tagline', 'Слоган магазина')}
                  {this.renderInput('slug', 'Slug')}
                  {this.renderInput('short_desc', 'Краткое описание магазина')}
                  {this.renderInput('full_desc', 'Полное описание магазина')}
                  <Button
                    type="button"
                    onClick={() => {
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Page(EditStore);
