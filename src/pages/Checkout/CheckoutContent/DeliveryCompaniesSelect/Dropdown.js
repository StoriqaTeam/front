// @flow strict

import * as React from 'react';
import { map } from 'ramda';

import { Icon } from 'components/Icon';
import { Checkbox } from 'components/common/Checkbox';
import { Button } from 'components/common';
import { formatPrice, checkCurrencyType } from 'utils';

import type { AvailableDeliveryPackageType } from 'relay/queries/fetchAvailableShippingForUser';
import type { AllCurrenciesType } from 'types';

import './Dropdown.scss';

type PropsType = {
  currency: AllCurrenciesType,
  isOpen: boolean,
  isLoading: boolean,
  isError: boolean,
  packages: Array<AvailableDeliveryPackageType>,
  selectedPackage: ?AvailableDeliveryPackageType,
  toggleExpand: (e: SyntheticEvent<HTMLDivElement>) => void,
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

  handleClick = (e: SyntheticEvent<HTMLDivElement>) => {
    // $FlowIgnore
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    if (this.props.isOpen) {
      this.props.toggleExpand(e);
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
      currency,
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
              <span>
                <Icon type="arrowExpand" />
              </span>
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
                          label={item.name}
                          dataTest="deliverySelectCheckbox"
                        />
                      </div>
                    </div>
                    <span styleName="price">
                      {`${formatPrice(
                        item.price,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency || ''}`}
                    </span>
                  </div>
                ),
                packages,
              )}
              <div styleName="buttonRow">
                {this.props.isError && (
                  <span styleName="error">Error :( Please try again</span>
                )}
                <Button
                  big
                  onClick={onAccept}
                  isLoading={this.props.isLoading}
                  dataTest="deliverySelectAcceptButton"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )}
        {!isOpen && (
          <div
            styleName="closed"
            onClick={toggleExpand}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
            data-test="deliverySelect"
          >
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
