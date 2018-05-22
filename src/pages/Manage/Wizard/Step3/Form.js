// @flow

import React, { Component } from 'react';
import { map, pathOr, whereEq } from 'ramda';

import { findCategory } from 'utils';
import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { CategorySelector } from 'components/CategorySelector';

import AttributesForm from './AttributesForm';
import Uploaders from './Uploaders';

import type { AttributeType, AttrValueType } from './AttributesForm';

import './Form.scss';

type CategoriesTreeType = {
  rawId: number,
  level: number,
  children: ?Array<CategoriesTreeType>,
};

type PropsType = {
  categoryId: ?number,
  categories: CategoriesTreeType,
  onChange: (obj: { [name: string]: string }) => void,
  data: {
    categoryId: ?number,
  },
  aditionalPhotosMap: any,
  onUpload: (type: boolean, e: any) => void,
};

type StateType = {
  attrValues: Array<AttrValueType>,
};

class ThirdForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { categoryId } = props;
    const catObj = findCategory(
      whereEq({ rawId: parseInt(categoryId, 10) }),
      props.categories,
    ) || { getAttributes: [] };
    this.state = {
      attrValues: this.prepareDefaultValuesForAttributes(catObj.getAttributes),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.categoryId !== this.props.data.categoryId) {
      const {
        data: { categoryId },
      } = nextProps;
      const catObj = findCategory(
        whereEq({ rawId: parseInt(categoryId, 10) }),
        nextProps.categories,
      ) || { getAttributes: [] };
      this.setState({
        attrValues: this.prepareDefaultValuesForAttributes(
          catObj.getAttributes,
        ),
      });
    }
  }

  handleChangeData = e => {
    const {
      target: { value, name },
    } = e;
    this.props.onChange({ [name]: value });
  };

  handleAttributesChange = (attrs: Array<AttrValueType>) => {
    console.log('>>> Form 3 handleAttributesChange new attrs values: ', attrs);
    const { onChangeAttrs } = this.props;
    this.setState({
      attrValues: attrs,
    });
    onChangeAttrs(attrs);
  };

  defaultValueForAttribute = (attribute: AttributeType): AttrValueType => {
    const noValueString = 'No value';
    let valueStr = noValueString;
    const {
      metaField: { translatedValues, values },
    } = attribute;
    if (values && values.length > 0) {
      valueStr = values[0] || noValueString;
    } else if (translatedValues.length > 0) {
      // $FlowIgnoreMe
      valueStr = pathOr(
        noValueString,
        [0, 'translations', 0, 'text'],
        translatedValues,
      );
    }
    return {
      attrId: attribute.rawId,
      value: valueStr,
    };
  };

  prepareDefaultValuesForAttributes = (
    attrs: Array<AttributeType>,
  ): Array<AttrValueType> => map(this.defaultValueForAttribute, attrs);

  renderAttributes = () => {
    // console.log('*** renderAttributes');
    const { categoryId } = this.props.data;
    const catObj = findCategory(
      whereEq({ rawId: parseInt(categoryId, 10) }),
      // whereEq({ rawId: 34 }),
      this.props.categories,
    );
    console.log('*** catObj: ', catObj);
    return (
      catObj &&
      catObj.getAttributes && (
        <div styleName="section">
          <div styleName="sectionName">Properties</div>
          <AttributesForm
            attributes={catObj.getAttributes}
            onChange={this.handleAttributesChange}
            values={this.state.attrValues}
          />
        </div>
      )
    );
  };

  render() {
    const { data, aditionalPhotosMap } = this.props;
    const { categoryId } = data;
    console.log('>>> Form 3 render: ', { data, aditionalPhotosMap });

    return (
      <div styleName="wrapper">
        <div styleName="formWrapper">
          <div styleName="headerTitle">Add new product</div>
          <div styleName="headerDescription">
            Fill up the forms below to show up as many attributes of your good
            to make it clear for buyer
          </div>
          <div styleName="form">
            <div styleName="section">
              <div styleName="formItem">
                <Input
                  id="name"
                  value={data.name}
                  label="Product name"
                  onChange={this.handleChangeData}
                  fullWidth
                />
              </div>
              <div styleName="formItem">
                <Textarea
                  id="shortDescription"
                  value={data.shortDescription}
                  label="Short description"
                  onChange={this.handleChangeData}
                  fullWidth
                />
              </div>
            </div>
            <div styleName="section">
              <div styleName="sectionName">Product photo</div>
              <Uploaders
                onUpload={this.props.onUpload}
                photoMain={data.product.photoMain}
                aditionalPhotosMap={aditionalPhotosMap}
              />
            </div>
            {/* <div styleName="section">
              <div styleName="sectionName">Product photo</div>
              <Uploaders onUpload={onUpload} />
            </div> */}
            <div styleName="section">
              <div styleName="sectionName">General settings and pricing</div>
              <div styleName="formItem">
                <CategorySelector
                  categories={this.props.categories}
                  onSelect={id => this.props.onChange({ categoryId: id })}
                />
              </div>
              <div styleName="formItem">
                <Input
                  id="price"
                  value={data.price || ''}
                  label="Price"
                  onChange={this.handleChangeData}
                  fullWidth
                  type="number"
                />
                {/* <span styleName="">STQ</span> */}
              </div>
              <div styleName="formItem">
                <Input
                  id="vendorCode"
                  value={data.vendorCode || ''}
                  label="Vendor code"
                  onChange={this.handleChangeData}
                  fullWidth
                />
                {/* <span styleName="">STQ</span> */}
              </div>
              <div styleName="formItem">
                <Input
                  id="cashback"
                  value={data.cashback || ''}
                  label="Cashback"
                  onChange={this.handleChangeData}
                  fullWidth
                  type="number"
                />
                {/* <span styleName="">STQ</span> */}
              </div>
            </div>
            {categoryId && this.renderAttributes()}
          </div>
        </div>
      </div>
    );
  }
}

export default ThirdForm;
