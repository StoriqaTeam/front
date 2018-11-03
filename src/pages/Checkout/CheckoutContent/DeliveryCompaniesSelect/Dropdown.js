// @flow strict

import * as React from 'react';
import { map } from 'ramda';

import { Icon } from 'components/Icon';
import { Checkbox } from 'components/common/Checkbox';
import { Button } from 'components/common';

import type { AvailableDeliveryPackageType } from './DeliveryCompaniesSelect.utils';

import './Dropdown.scss';

type PropsType = {
  isOpen: boolean,
  isLoading: boolean,
  isError: boolean,
  packages: Array<AvailableDeliveryPackageType>,
  selectedPackage: ?AvailableDeliveryPackageType,
  toggleExpand: () => void,
  onPackageSelect: (id: string) => void,
  onAccept: () => void,
};

type StateType = {
  //
};

class Dropdown extends React.Component<PropsType, StateType> {
  state = {
    //
  };

  componentWillMount() {
    // $FlowIgnoreMe
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    // $FlowIgnoreMe
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  node: ?HTMLDivElement;

  handleClick = (e: SyntheticInputEvent<*>) => {
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    if (this.props.isOpen) {
      this.props.toggleExpand();
    }
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
          <div
            ref={ref => {
              this.node = ref;
            }}
          >
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
                {this.props.isError && (
                  <span styleName="error">Error :( Please try again</span>
                )}
                <Button big onClick={onAccept} isLoading={this.props.isLoading}>
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
