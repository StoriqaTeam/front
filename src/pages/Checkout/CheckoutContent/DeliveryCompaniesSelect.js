// @flow strict

import React, { Component } from 'react';
import { map, find, whereEq } from 'ramda';

import { Icon } from 'components/Icon';
import { Checkbox } from 'components/common/Checkbox';
import { SpinnerCircle, Button } from 'components/common';

import { fetchAvailableDeliveryPackages } from './DeliveryCompaniesSelect.utils';
import type { AvailableDeliveryPackageType } from './DeliveryCompaniesSelect.utils';

import './DeliveryCompaniesSelect.scss';

type PropsType = {
  country: string,
  baseProductId: number,
  onPackagesFetched: (packages: Array<AvailableDeliveryPackageType>) => void,
};

type StateType = {
  isFetching: boolean,
  isFetchingError: boolean,
  packages: Array<AvailableDeliveryPackageType>,
  isDropdownOpened: boolean,
  selectedPackage: ?AvailableDeliveryPackageType,
};

const Loading = () => (
  <div styleName="loadingWrapper">
    <div>loading...</div>
    <SpinnerCircle
      additionalStyles={{ width: '2rem', height: '2rem' }}
      containerStyles={{ width: '2rem', height: '2rem', marginLeft: 0 }}
    />
  </div>
);

const FetchError = ({ onRetryClick }: { onRetryClick: () => void }) => (
  <div styleName="errorWrapper">
    <div>Error :( Please, retry</div>
    <div>
      <Button small onClick={onRetryClick}>
        Retry
      </Button>
    </div>
  </div>
);

type DropdownPropsType = {
  isOpen: boolean,
  packages: Array<AvailableDeliveryPackageType>,
  selectedPackage: ?AvailableDeliveryPackageType,
  toggleExpand: () => void,
  onPackageSelect: (id: string) => void,
  onAccept: () => void,
};
const Dropdown = (props: DropdownPropsType) => {
  const { isOpen, selectedPackage, onPackageSelect } = props;
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
            <button onClick={props.toggleExpand}>
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
              props.packages,
            )}
            <div styleName="buttonRow">
              <Button big onClick={props.onAccept}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isOpen && (
        <div styleName="closed">
          <div styleName="label">
            {selectedPackage != null ? selectedPackage.name : 'Choose company'}
          </div>
          <button onClick={props.toggleExpand}>
            <Icon type="arrowExpand" />
          </button>
        </div>
      )}
    </div>
  );
};

class DeliveryCompaniesSelect extends Component<PropsType, StateType> {
  state = {
    isFetching: true,
    isFetchingError: false,
    packages: [],
    isDropdownOpened: false,
    selectedPackage: null,
  };

  componentDidMount() {
    this.mounted = true;
    this.fetchData();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean = false;

  fetchData = () => {
    this.setState({ isFetching: true, isFetchingError: false });
    fetchAvailableDeliveryPackages({
      destinationCountry: this.props.country,
      baseProductId: this.props.baseProductId,
    })
      .then(packages => {
        this.setState({ packages }, () => {
          this.props.onPackagesFetched(packages);
        });
      })
      .catch(() => this.setState({ isFetchingError: true }))
      .finally(() => {
        this.setState({ isFetching: false });
      });
  };

  render() {
    const { isFetching, isFetchingError, selectedPackage } = this.state;
    return (
      <div>
        {isFetching && <Loading />}
        {isFetchingError && <FetchError onRetryClick={this.fetchData} />}
        {!isFetching &&
          !isFetchingError && (
            <Dropdown
              packages={this.state.packages}
              selectedPackage={selectedPackage}
              isOpen={this.state.isDropdownOpened}
              toggleExpand={() => {
                this.setState(prevState => ({
                  isDropdownOpened: !prevState.isDropdownOpened,
                }));
              }}
              onPackageSelect={(id: string) => {
                if (selectedPackage && selectedPackage.id === id) {
                  this.setState({ selectedPackage: null });
                } else {
                  this.setState({
                    selectedPackage: find(whereEq({ id }), this.state.packages),
                  });
                }
              }}
              onAccept={() => {
                this.setState({ isDropdownOpened: false });
              }}
            />
          )}
      </div>
    );
  }
}

export default DeliveryCompaniesSelect;
