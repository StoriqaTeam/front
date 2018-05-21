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

type DataType = {
  userId: ?number,
  storeId: ?number,
  name: ?string,
  slug: ?string,
  shortDescription: ?string,
  defaultLanguage: ?string,
  country: ?string,
  address: ?string,
};

type PropsType = {
  languages: Array<{ isoCode: string }>,
  initialData: DataType,
  onChange: (data: { [name: string]: string }) => void,
};

type StateType = DataType;

class SecondForm extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps = (nextProps, prevState) => {
    console.log('>>> Form 2 getDerivedStateFromProps: ', {
      initialData: nextProps.initialData,
      prevState,
    });
    const store = pathOr(null, ['initialData', 'store'], nextProps);
    const storeId = pathOr(null, ['initialData', 'storeId'], nextProps);
    const newState = {
      ...nextProps.initialData,
      ...prevState,
      store,
      storeId,
    };
    console.log('<<< Form 2 getDerivedStateFromProps: ', { newState });
    return newState;
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      ...props.initialData,
    };
  }

  handleOnSelectLanguage = item => {
    const { onChange } = this.props;
    console.log('>>> Form2 handleOnSelectLanguage state', this.state);
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

  handleChangeAddressData = addressData => {
    const { onChange } = this.props;
    console.log('>>> Form2 handleChangeAddressData addressData', addressData);
    if (onChange && addressData) {
      onChange({
        ...this.state,
        addressFull: {
          ...omit(['address', 'postalCodeSuffix'], addressData),
          value: addressData.address,
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
