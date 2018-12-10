// @flow strict

import React, { PureComponent } from 'react';

import { Checkbox, Input } from 'components/common';

import t from './i18n';

import './PreOrder.scss';

type PreOrderType = {
  preOrderDays: string,
  preOrder: boolean,
};

type StateType = PreOrderType;

type PropsType = {
  preOrderDays: string,
  preOrder: boolean,
  onChangePreOrder: (data: PreOrderType) => void,
};

class PreOrder extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { preOrderDays, preOrder } = props;

    this.state = { preOrderDays, preOrder };
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      window.addEventListener('click', this.handleClick);
    }
  }

  componentDidUpdate(prevProps: PropsType) {
    const { preOrderDays, preOrder } = this.state;
    if (
      prevProps.preOrderDays !== preOrderDays ||
      prevProps.preOrder !== preOrder
    ) {
      this.props.onChangePreOrder({ preOrderDays, preOrder });
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('click', this.handleClick);
    }
  }

  preOrderDaysInput: ?HTMLInputElement;

  handleClick = (e: SyntheticInputEvent<>) => {
    const isPreOrderDaysInput =
      this.preOrderDaysInput && this.preOrderDaysInput.contains(e.target);

    if (!isPreOrderDaysInput && !this.state.preOrderDays) {
      this.setState({ preOrder: false });
    }
  };

  handleOnChangePreOrder = () => {
    this.setState((prevState: StateType) => {
      if (this.preOrderDaysInput) {
        if (!prevState.preOrder) {
          this.preOrderDaysInput.focus();
        }
        if (prevState.preOrder) {
          this.preOrderDaysInput.blur();
        }
      }
      return { preOrder: !prevState.preOrder };
    });
  };

  handleOnChangePreOrderDays = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    const regexp = /(^\d*$)/;
    if (!regexp.test(value)) {
      return;
    }
    this.setState({
      preOrderDays: value.replace(/^0+/, '0').replace(/^0+(\d)/, '$1'),
    });
  };

  handleOnBlurPreOrderDays = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    if (!value || value === '0') {
      this.setState({ preOrderDays: value });
    }
  };

  render() {
    const { preOrderDays, preOrder } = this.state;

    return (
      <div styleName="container">
        <div styleName="preOrderTitle">
          <div styleName="title">
            <strong>{t.availableForPreOrder}</strong>
          </div>
          <div styleName="preOrderCheckbox">
            <Checkbox
              inline
              id="preOrderCheckbox"
              isChecked={preOrder}
              onChange={this.handleOnChangePreOrder}
            />
          </div>
        </div>
        <div styleName="preOrderDaysInput">
          <Input
            inputRef={node => {
              this.preOrderDaysInput = node;
            }}
            fullWidth
            id="preOrderInput"
            label={t.labelLeadTime}
            onChange={this.handleOnChangePreOrderDays}
            onBlur={this.handleOnBlurPreOrderDays}
            value={preOrderDays || ''}
            dataTest="variantPreOrderDaysInput"
          />
        </div>
      </div>
    );
  }
}

export default PreOrder;
