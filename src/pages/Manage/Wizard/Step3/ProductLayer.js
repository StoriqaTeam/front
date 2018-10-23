// @flow

import React from 'react';

import { Icon } from 'components/Icon';

import './View/View.scss';

type PropsType = {
  onDelete: () => void,
  onEdit: () => void,
};

const ProductLayer = ({ onEdit, onDelete }: PropsType) => (
  <div styleName="layer">
    <div
      styleName="editbutton"
      onClick={onEdit}
      role="button"
      onKeyDown={() => {}}
      tabIndex={0}
      data-test="wizardEditProductButton"
    >
      <Icon type="note" size={56} />
      <span styleName="buttonLabel">Edit product</span>
    </div>
    <div
      styleName="editbutton"
      onClick={onDelete}
      role="button"
      onKeyDown={() => {}}
      tabIndex={0}
      data-test="wizardDeleteProductButton"
    >
      <Icon type="basket" size={56} />
      <span styleName="buttonLabel">Delete product</span>
    </div>
  </div>
);

export default ProductLayer;
