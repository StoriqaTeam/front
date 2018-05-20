// @flow

import React from 'react';
import { map, find, pathOr, whereEq } from 'ramda';

import { getNameText, flattenFunc, findCategory } from 'utils';
import { Icon } from 'components/Icon';
import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { CategorySelector } from 'components/CategorySelector';

import AttributesForm from './AttributesForm';
import Uploaders from './Uploaders';

import './Form.scss';

type PropsType = {
};

const ThirdForm = ({ data, onChange, categories, onUpload }: PropsType) => {
  // console.log('^^^^ ThirdForm props: ', data);

  const handleChangeData = e => {
    const {
      target: { value, name },
    } = e;
    onChange({ [name]: value });
  };

  const renderAttributes = () => {
    // console.log('*** renderAttributes');
    const { categoryId } = data;
    const catObj = findCategory(
      whereEq({ rawId: parseInt(categoryId, 10) }),
      // whereEq({ rawId: 34 }),
      categories,
    );
    console.log('*** catObj: ', catObj);
    return ((catObj && catObj.getAttributes) &&
      <div styleName="section">
        <div styleName="sectionName">Properties</div>
        <AttributesForm attributes={catObj.getAttributes} onChange={onChange} />
      </div>
    );
  };

  const { addressFull, categoryId } = data;
  console.log('*** form render categoryId, data: ', { categoryId, data });

  return (
    <div styleName="wrapper">
      <div styleName="formWrapper">
        <div styleName="headerTitle">Add new product</div>
        <div styleName="headerDescription">
          Fill up the forms below to show up as many attributes of your good to
          make it clear for buyer
        </div>
        <div styleName="form">
          <div styleName="section">
            <div styleName="formItem">
              <Input
                id="name"
                value={data.name}
                label="Product name"
                onChange={handleChangeData}
                fullWidth
              />
            </div>
            <div styleName="formItem">
              <Textarea
                id="shortDescription"
                value={data.shortDescription}
                label="Short description"
                onChange={handleChangeData}
                fullWidth
              />
            </div>
          </div>
          <div styleName="section">
            <div styleName="sectionName">Product photo</div>
            <Uploaders onUpload={onUpload} />
          </div>
          {/* <div styleName="section">
            <div styleName="sectionName">Product photo</div>
            <Uploaders onUpload={onUpload} />
          </div> */}
          <div styleName="section">
            <div styleName="sectionName">General settings and pricing</div>
            <div styleName="formItem">
              <CategorySelector
                categories={categories}
                onSelect={id => onChange({ categoryId: id })}
              />
            </div>
            <div styleName="formItem">
              <Input
                id="price"
                value={data.price || ''}
                label="Price"
                onChange={handleChangeData}
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
                onChange={handleChangeData}
                fullWidth
              />
              {/* <span styleName="">STQ</span> */}
            </div>
            <div styleName="formItem">
              <Input
                id="cashback"
                value={data.cashback || ''}
                label="Cashback"
                onChange={handleChangeData}
                fullWidth
                type="number"
              />
              {/* <span styleName="">STQ</span> */}
            </div>
          </div>
          {categoryId && renderAttributes()}
        </div>
      </div>
    </div>
  );
};

export default ThirdForm;
