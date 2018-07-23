// @flow

import React from 'react';
import { pathOr, omit, map, find } from 'ramda';

import { Select } from 'components/common/Select';
import { AddressForm } from 'components/AddressAutocomplete';

import './Form.scss';

const languagesDic = {
  EN: 'English',
  CH: 'Chinese',
  DE: 'German',
  RU: 'Russian',
  ES: 'Spanish',
  FR: 'French',
  KO: 'Korean',
  PO: 'Portuguese',
  JA: 'Japanese',
};

type AddressType = {
  value?: ?string,
  country?: ?string,
  administrativeAreaLevel1?: ?string,
  administrativeAreaLevel2?: ?string,
  locality?: ?string,
  political?: ?string,
  postalCode?: ?string,
  route?: ?string,
  streetNumber?: ?string,
  placeId?: ?string,
};

type DataType = {
  userId: ?number,
  storeId: ?number,
  name: ?string,
  slug: ?string,
  shortDescription: ?string,
  defaultLanguage: ?string,
  country: ?string,
  value: ?string,
  addressFull: AddressType,
};

type PropsType = {
  languages: Array<{ isoCode: string }>,
  initialData: DataType,
  onChange: DataType => void,
};

type StateType = DataType;

class SecondForm extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps = (
    nextProps: PropsType,
    prevState: StateType,
  ) => {
    // $FlowIgnoreMe
    const store = pathOr(null, ['initialData', 'store'], nextProps);
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['initialData', 'storeId'], nextProps);
    const newState = {
      ...prevState,
      ...nextProps.initialData,
      store,
      storeId,
    };
    return newState;
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      ...props.initialData,
    };
  }

  handleOnSelectLanguage = (item: { id: string, label: string }) => {
    const { onChange } = this.props;
    this.setState(
      {
        defaultLanguage: item.id,
      },
      () => {
        onChange({
          ...this.state,
        });
      },
    );
  };

  handleChangeAddressData = (addressData: AddressType) => {
    const { onChange } = this.props;
    if (onChange && addressData) {
      onChange({
        ...this.state,
        addressFull: {
          ...omit(['postalCodeSuffix'], addressData),
        },
      });
    }
  };

  render() {
    const { languages } = this.props;
    const { addressFull, defaultLanguage } = this.state;
    const languagesItems = map(
      item => ({
        id: item.isoCode.toUpperCase(),
        label: languagesDic[item.isoCode.toUpperCase()],
      }),
      languages,
    );
    const findActiveItem = find(item => item.id === defaultLanguage);
    return (
      <div styleName="form">
        <div styleName="formItem">
          <Select
            forForm
            fullWidth
            label="Main language"
            activeItem={findActiveItem(languagesItems)}
            items={languagesItems}
            onSelect={this.handleOnSelectLanguage}
            dataTest="wizardLanguagesSelect"
          />
        </div>
        <div styleName="formItem addressForm">
          <AddressForm
            isOpen
            onChangeData={this.handleChangeAddressData}
            country={addressFull ? addressFull.country : null}
            address={addressFull ? addressFull.value : null}
            addressFull={addressFull}
          />
        </div>
      </div>
    );
  }
}

export default SecondForm;
