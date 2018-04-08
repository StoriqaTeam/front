// @flow

import React, { Component } from 'react';
// import { createRefetchContainer, graphql } from 'react-relay';
import { pathOr, map, addIndex, filter, complement, isNil } from 'ramda';

import { UploadWrapper } from 'components/Upload';
import { MiniSelect } from 'components/MiniSelect';
import { uploadFile } from 'utils';

import './Characteristics.scss';

type PropsType = {
  attribute: { rawId: number },
  onSelect: ({ attrId: number, value: string }) => void,
};

type StateType = {
  items: Array<[]>,
  selectedItem: ?{},
  characteristicImg: ?string,
};

class CharacteristicItem extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    if (this.state.items.length === 0) {
      const { attribute } = props;
      const selectItems = this.getSelectItems(attribute);
      this.state = {
        items: selectItems,
        selectedItem: selectItems[0],
      };
    }
  }

  state: StateType = {
    selectedItem: null,
    items: [],
    characteristicImg: null,
  };

  componentDidMount() {
    this.props.onSelect({
      attrId: this.props.attribute.rawId,
      value: this.state.selectedItem.label,
    });
  }

  getSelectItems = (attributes: {}) => {
    const values = pathOr(null, ['metaField', 'values'], attributes);
    const translatedValues = pathOr(null, ['metaField', 'translatedValues'], attributes);
    const mapIndexed = addIndex(map);

    if (values) {
      return mapIndexed((item, idx) => ({ id: `${idx}`, label: item }), values);
    }

    const items = mapIndexed((item, idx) => {
      const text = pathOr(null, [0, 'text'], item);
      if (text) {
        return {
          id: `${idx}`,
          label: text,
        };
      }
      return null;
    }, translatedValues);
    return filter(complement(isNil), items);
  };

  handleSelect = (value: string) => {
    this.setState({ selectedItem: value });
    this.props.onSelect({
      attrId: this.props.attribute.rawId,
      value: value.label,
    });
  };

  handleOnUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    this.setState({ characteristicImg: result.url });
  }

  render() {
    const { attribute } = this.props;
    const { characteristicImg } = this.state;
    const name = pathOr('', ['name', 0, 'text'], attribute);
    return (
      <div styleName="item">
        <div styleName="characteristicImg">
          <UploadWrapper
            id={attribute.id}
            onUpload={this.handleOnUpload}
            buttonHeight={80}
            buttonWidth={80}
            buttonIconType="upload"
            overPicture={characteristicImg}
          />
        </div>
        <MiniSelect
          forForm
          fullWidth
          label={name}
          activeItem={this.state.selectedItem}
          items={this.state.items}
          onSelect={this.handleSelect}
        />
      </div>
    );
  }
}

export default CharacteristicItem;

// export default createRefetchContainer(
//   CharacteristicItem,
//   graphql`
//     fragment CharacteristicItem_me on User {
//       id
//     }
//   `,
//   graphql`
//     query CharacteristicItemQuery($attrId: ID!) {
//       node(id: $attrId) {
//         ... on Attribute {
//           id
//           rawId
//           name {
//             lang
//             text
//           }
//           valueType
//           metaField {
//             values
//             translatedValues {
//               lang
//               text
//             }
//             uiElement
//           }
//         }
//       }
//     }
//   `,
// );
