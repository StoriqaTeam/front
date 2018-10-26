// @flow

import React, { PureComponent } from 'react';
import { filter, propEq, map } from 'ramda';

import { Row, Col } from 'layout';

import type {
  GetAttributeType,
  AttributeValueType,
} from 'pages/Manage/Store/Products/types';

import CharacteristicItem from './CharacteristicItem';

import './Characteristics.scss';

type PropsType = {
  onChange: (values: Array<AttributeValueType>) => void,
  values: Array<AttributeValueType>,
  customAttributes: Array<GetAttributeType>,
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
    return (
      <div id="attributes" styleName="container">
        <div styleName="items">
          <Row>
            {map(
              item => (
                <Col key={item.id} size={12} sm={12} md={6} lg={4} xl={4}>
                  <CharacteristicItem
                    attribute={item}
                    onSelect={this.handleItemChange}
                    value={
                      filter(propEq('attrId', item.rawId), this.props.values)[0]
                    }
                  />
                </Col>
              ),
              customAttributes,
            )}
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

export default Characteristics;
