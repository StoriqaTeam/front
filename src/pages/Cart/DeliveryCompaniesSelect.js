// @flow strict

import React, { Component } from 'react';

import { log } from 'utils';

import { fetchAvailableDeliveryPackages } from './DeliveryCompaniesSelect.utils';
import type { AvailableDeliveryPackageType } from './DeliveryCompaniesSelect.utils';

type PropsType = {
  country: string,
  baseProductId: number,
  onPackagesFetched: (packages: Array<AvailableDeliveryPackageType>) => void,
};

type StateType = {
  isFetching: boolean,
  fetchingError: ?string,
  packages: Array<AvailableDeliveryPackageType>,
};

class DeliveryCompaniesSelect extends Component<PropsType, StateType> {
  state = {
    isFetching: false,
    fetchingError: null,
    packages: [],
  };

  componentDidMount() {
    this.mounted = true;
    this.fetchData();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchData = () => {
    this.setState({ isFetching: true });
    fetchAvailableDeliveryPackages({
      destinationCountry: this.props.country,
      baseProductId: this.props.baseProductId,
    })
      .then(packages => {
        this.setState({ packages }, () => {
          this.props.onPackagesFetched(packages);
        });
      })
      .catch((err: Error) => this.setState({ fetchingError: err.message }))
      .finally(() => {
        this.setState({ isFetching: false });
      });
  };

  mounted: boolean = false;

  render() {
    const { isFetching, fetchingError } = this.state;
    return (
      <div>
        {isFetching && <div>loading...</div>}
        {fetchingError != null && <div>this.fetchingError</div>}
        {!isFetching &&
          fetchingError === null && (
            <div>{JSON.stringify(this.state.packages)}</div>
          )}
      </div>
    );
  }
}

export default DeliveryCompaniesSelect;
