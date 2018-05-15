// @flow

import React, { Component } from 'react';
import { map, find, propEq } from 'ramda';

import { Select } from 'components/common/Select';

import './BirthdateSelect.scss';

type ItemType = { id: string, label: string };

type PropsType = {
  handleBirthdate: Function,
  birthdate: ?string,
};

type StateType = {
  years: Array<ItemType>,
  months: Array<ItemType>,
  days: Array<ItemType>,
  yearValue: ?ItemType,
  monthValue: ?ItemType,
  dayValue: ?ItemType,
};

class BirthdateSelect extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      years: this.handleYearGenerate(100, 1919),
      months: this.handleMonthGenerate(12, 1),
      days: this.handleDayGenerate(31, 1),
      yearValue: null,
      monthValue: null,
      dayValue: null,
    };
  }

  componentWillMount() {
    const { birthdate } = this.props;
    if (birthdate) {
      const date = new Date(birthdate);
      const { years, months, days } = this.state;
      const yearValue = `${date.getFullYear()}`;
      const monthValue = `${date.getMonth() + 1}`;
      const dayValue = `${date.getDate()}`;
      const yearSelectValue = find(propEq('id', yearValue))(years);
      const monthSelectValue = find(
        propEq('id', monthValue.length === 1 ? `0${monthValue}` : monthValue),
      )(months);
      const daySelectValue = find(propEq('id', dayValue))(days);
      this.setState({
        yearValue: yearSelectValue,
        monthValue: monthSelectValue,
        dayValue: daySelectValue,
      });
    }
  }

  handleYearGenerate = (count: number, start: number) => {
    const items = [
      ...Array.from(Array(count).keys(), x => count - 1 + start - x),
    ];
    return map(item => ({ id: `${item}`, label: `${item}` }), items);
  };

  handleMonthGenerate = (count: number, start: number) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const items = [...Array.from(Array(count).keys(), x => start + x)];
    return map(
      item => ({
        id: `${item}`.length === 1 ? `0${item}` : `${item}`,
        label: monthNames[item - 1],
      }),
      items,
    );
  };

  handleDayGenerate = (count: number, start: number) => {
    const items = [...Array.from(Array(count).keys(), x => start + x)];
    return map(
      item => ({
        id: `${item}`,
        label: `${item}`.length === 1 ? `0${item}` : `${item}`,
      }),
      items,
    );
  };

  handleSelect = (value: ItemType, id: string) => {
    this.setState(() => ({ [`${id}Value`]: value }), this.handleCheckDate);
  };

  handleCheckDate = () => {
    const { yearValue, monthValue, dayValue } = this.state;
    if (yearValue && monthValue && dayValue) {
      this.props.handleBirthdate(
        `${yearValue.label}-${monthValue.id}-${dayValue.label}`,
      );
    }
  };

  renderSelect = (id: string, label: string) => (
    <div styleName="item">
      <Select
        isBirthdate
        label={label}
        activeItem={this.state[`${id}Value`]}
        items={this.state[`${id}s`]}
        onSelect={value => this.handleSelect(value, id)}
        dataTest={`${id}SelectBirthdateProfile`}
      />
    </div>
  );

  render() {
    return (
      <div styleName="container">
        <div styleName="label">Birthdate</div>
        <div styleName="items">
          {this.renderSelect('year', 'Year')}
          {this.renderSelect('month', 'Month')}
          {this.renderSelect('day', 'Day')}
        </div>
      </div>
    );
  }
}

export default BirthdateSelect;
