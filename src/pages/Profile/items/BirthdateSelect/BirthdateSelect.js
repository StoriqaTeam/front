// @flow

import React, { Component } from 'react';
import { map, find, propEq } from 'ramda';

import { Select } from 'components/common/Select';

import './BirthdateSelect.scss';

type ItemType = { id: string, label: string };

type PropsType = {
  label: ?label,
  handleBirthdateSelect: (value: string) => void,
  birthdate: ?string,
  errors: ?Array<string>,
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
      years: this.generateYears(100, 1919),
      months: this.generateMonths(12, 1),
      days: this.generateDays(31, 1),
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

  generateYears = (count: number, start: number) => {
    const items = [
      ...Array.from(Array(count).keys(), x => count - 1 + start - x),
    ];
    return map(item => ({ id: `${item}`, label: `${item}` }), items);
  };

  generateMonths = (count: number, start: number) => {
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

  generateDays = (count: number, start: number) => {
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
    const { yearValue, monthValue, dayValue } = this.state;
    const year = yearValue ? yearValue.label : null;
    const month = monthValue ? monthValue.id : null;
    const day = dayValue ? dayValue.label : null;

    const checkDayMonth = (monthV: ?string, dayV: ?string) => {
      const bool1 =
        (monthV === '04' ||
          monthV === '06' ||
          monthV === '09' ||
          monthV === '11') &&
        dayV === '31';
      const bool2 =
        monthV === '02' &&
        ((Number(year) % 4 !== 0 &&
          (dayV === '29' || dayV === '30' || dayV === '31')) ||
          (Number(year) % 4 === 0 && (dayV === '30' || dayV === '31')));
      return bool1 || bool2;
    };

    if (
      id === 'year' &&
      Number(value.label) % 4 !== 0 &&
      month === '02' &&
      day === '29'
    ) {
      this.setState(() => ({ dayValue: null }), this.checkDate);
    } else if (id === 'month' && checkDayMonth(value.id, day)) {
      this.setState(() => ({ dayValue: null }), this.checkDate);
    } else if (id === 'day' && checkDayMonth(month, value.label)) {
      this.setState(() => ({ monthValue: null }), this.checkDate);
    }
    this.setState(() => ({ [`${id}Value`]: value }), this.checkDate);
  };

  checkDate = () => {
    const { yearValue, monthValue, dayValue } = this.state;
    if (yearValue && monthValue && dayValue) {
      this.props.handleBirthdateSelect(
        `${yearValue.label}-${monthValue.id}-${dayValue.label}`,
      );
    }
  };

  renderSelect = (id: string, label: string) => (
    <div styleName="item">
      <Select
        isBirthdate
        forForm
        label={label}
        activeItem={this.state[`${id}Value`]}
        items={this.state[`${id}s`]}
        onSelect={value => this.handleSelect(value, id)}
        dataTest={`${id}SelectBirthdateProfile`}
      />
    </div>
  );

  render() {
    const { errors, label } = this.props;
    return (
      <div styleName="container">
        {label && <div styleName="label">{label}</div>}
        <div styleName="items">
          {this.renderSelect('year', 'Year')}
          {this.renderSelect('month', 'Month')}
          {this.renderSelect('day', 'Day')}
        </div>
        {errors &&
          errors.length && (
            <div styleName="errors">
              {map((item, idx) => <div key={idx}>{item}</div>, errors)}
            </div>
          )}
      </div>
    );
  }
}

export default BirthdateSelect;
