// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { filter, propEq, find, map } from 'ramda';

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
};

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type PropsType = {
  onChange: Function,
  values: Array<AttributeValueType>,
  errors: ?Array<string>,

  customAttributes: Array<{
    attribute: AttributeType,
  }>,
};

class CustomCharacteristics extends PureComponent<PropsType> {
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
    const { errors } = this.props;
    console.log('---this.props.values', this.props.values);
    // $FlowIgnoreMe
    const attributes = map(
      item => ({ ...item.attribute }),
      this.props.customAttributes,
    );
    console.log('---attributes', attributes);
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Custom Characteristics</strong>
        </div>
        <div styleName="items">
          <Row>
            {attributes.map(item => (
              <Col key={item.id} size={12} sm={12} md={6} lg={4} xl={4}>
                <CharacteristicItem
                  attribute={item}
                  onSelect={this.handleItemChange}
                  value={
                    find(propEq('attrId', item.rawId), this.props.values) || {
                      attrId: -1,
                      value: '',
                    }
                  }
                />
              </Col>
            ))}
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

CustomCharacteristics.contextTypes = {
  directories: PropTypes.object,
};

export default CustomCharacteristics;
