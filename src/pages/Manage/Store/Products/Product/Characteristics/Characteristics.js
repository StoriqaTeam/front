// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { filter, propEq, map } from 'ramda';

import { Row, Col } from 'layout';

import CharacteristicItem from './CharacteristicItem';

import './Characteristics.scss';

type AttributeType = {
  id: string,
  rawId: number,
  name: {
    lang: string,
    text: string,
  },
  metaField: {
    translatedValues: ?Array<{}>,
    values: ?Array<string>,
  },
};

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: string,
};

type PropsType = {
  onChange: Function,
  values: Array<AttributeValueType>,
  customAttributes: Array<AttributeType>,
  errors: ?Array<string>,
};

class Characteristics extends PureComponent<PropsType> {
  handleItemChange = (attribute: AttributeValueType) => {
    const { attrId, value, metaField } = attribute;
    const filteredItems = filter(
      item => item.attrId !== attrId,
      this.props.values,
    );
    filteredItems.push({ attrId, value, metaField });
    this.props.onChange(filteredItems);
  };

  render() {
    const { errors, customAttributes } = this.props;
    console.log('---customAttributes', customAttributes);
    return (
      <div styleName="container">
        <div styleName="items">
          <Row>
            {map(item => (
              <Col key={item.id} size={12} sm={12} md={6} lg={4} xl={4}>
                <CharacteristicItem
                  attribute={item}
                  onSelect={this.handleItemChange}
                  value={filter(propEq('attrId', item.rawId), this.props.values)[0]}
                />
              </Col>
            ), customAttributes)}
          </Row>
        </div>
        <div styleName="errors">
          {errors &&
            map(
              item => (
                <div key={item} styleName="error">
                  {item}
                </div>
              ),
              errors,
            )}
        </div>
      </div>
    );
  }
}

Characteristics.contextTypes = {
  directories: PropTypes.object,
};

export default Characteristics;
