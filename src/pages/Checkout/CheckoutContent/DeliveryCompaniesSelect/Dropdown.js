// @flow strict

import React, { Component } from 'react';
import { map } from 'ramda';

import { Icon } from 'components/Icon';
import { Checkbox } from 'components/common/Checkbox';
import { Button } from 'components/common';

import type { AvailableDeliveryPackageType } from './DeliveryCompaniesSelect.utils';

import './Dropdown.scss';

type PropsType = {
  isOpen: boolean,
  packages: Array<AvailableDeliveryPackageType>,
  selectedPackage: ?AvailableDeliveryPackageType,
  toggleExpand: () => void,
  onPackageSelect: (id: string) => void,
  onAccept: () => void,
};

type StateType = {
  //
};

class Dropdown extends Component<PropsType, StateType> {
  state = {
    //
  };

  render() {
    const {
      isOpen,
      selectedPackage,
      onPackageSelect,
      toggleExpand,
      packages,
      onAccept,
    } = this.props;
    return (
      <div styleName="dropdown">
        {isOpen && (
          <div>
            <div styleName="opened">
              <div styleName="label">
                {selectedPackage != null
                  ? selectedPackage.name
                  : 'Choose company'}
              </div>
              <button onClick={toggleExpand}>
                <Icon type="arrowExpand" />
              </button>
            </div>
            <div styleName="packages">
              {map(
                item => (
                  <div styleName="row" key={item.id}>
                    <div styleName="title">
                      <div styleName="cb">
                        <Checkbox
                          id={item.id}
                          onChange={onPackageSelect}
                          isChecked={
                            selectedPackage && item.id === selectedPackage.id
                          }
                        />
                      </div>
                      {item.name}
                    </div>
                    <span>
                      {item.price} {item.currency}
                    </span>
                  </div>
                ),
                packages,
              )}
              <div styleName="buttonRow">
                <Button big onClick={onAccept}>
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )}
        {!isOpen && (
          <div styleName="closed">
            <div styleName="label">
              {selectedPackage != null
                ? selectedPackage.name
                : 'Choose company'}
            </div>
            <button onClick={toggleExpand}>
              <Icon type="arrowExpand" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
