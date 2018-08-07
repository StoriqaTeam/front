// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { filter, propEq, head, pathOr } from 'ramda';

import { Col } from 'layout';

import CharacteristicItem from './CharacteristicItem';

import './Characteristics.scss';

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type PropsType = {
  onChange: Function,
  values: Array<AttributeValueType>,
  category: {
    getAttributes: Array<{
      rawId: number,
    }>,
  },
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
    // $FlowIgnoreMe
    const attributes = pathOr([], ['getAttributes'], this.props.category);
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Characteristics</strong>
        </div>
        <div styleName="items">
          {attributes.map(item => (
            <Col key={item.id} size={12} sm={12} md={6} lg={4} xl={4}>
              <CharacteristicItem
                attribute={item}
                onSelect={this.handleItemChange}
                value={head(
                  filter(propEq('attrId', item.rawId), this.props.values),
                )}
              />
            </Col>
          ))}
        </div>
      </div>
    );
  }
}

Characteristics.contextTypes = {
  directories: PropTypes.object,
};

export default Characteristics;
