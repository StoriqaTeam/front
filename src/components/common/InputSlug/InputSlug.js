// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import { createRefetchContainer, graphql, Relay } from 'react-relay';

import debounce from 'lodash.debounce';
import { Input } from 'components/common/Input';

import './InputSlug.scss';

type PropsType = {
  slug: string,
  onChange: (value: string) => void,
  relay: Relay,
  realSlug: ?string,
  resetErrors: () => void,
};

type StateType = {
  isFocus: boolean,
  value: string,
  storeSlugExists: ?boolean,
  errors: ?Array<string>,
};

class InputSlug extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.errors) !== JSON.stringify(prevState.errors)) {
      return {
        ...prevState,
        errors: nextProps.errors,
      };
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    this.state = {
      isFocus: false,
      value: props.slug,
      storeSlugExists: null,
      errors: null,
    };

    this.checkSlug = debounce(this.checkSlug, 250);
  }

  checkSlug = (value: string) => {
    const { realSlug } = this.props;
    if (realSlug && value === realSlug) {
      this.props.onChange(realSlug);
      return;
    }
    this.props.relay.refetch(
      {
        slug: value,
      },
      null,
      () => {
        const store = this.props.relay.environment.getStore();
        const storeSlugExists = pathOr(
          null,
          [`storeSlugExists(slug:"${this.state.value}")`],
          store.getSource().get('client:root'),
        );

        if (!storeSlugExists) {
          this.props.onChange(this.state.value);
        }
        // $FlowIgnore
        this.setState({
          storeSlugExists: value === '' ? null : storeSlugExists,
        });
      },
      { force: true },
    );
  };

  handleChange = (e: any) => {
    const { slug, resetErrors } = this.props;
    resetErrors();
    const { value } = e.target;
    const correctValue = value
      .toString()
      .toLowerCase()
      // Replace spaces with -
      .replace(/\s+/g, '-')
      // Remove all non-word chars
      .replace(/[^\w\-]+/g, '') // eslint-disable-line
      // Replace multiple - with single -
      .replace(/\-\-+/g, '-') // eslint-disable-line
      // Trim - from start of text
      .replace(/^-+/, '')
      // Trim - from end of text
      .replace(/-+$/, '');
    if (slug !== correctValue) {
      this.setState(() => ({
        value: correctValue,
        storeSlugExists: null,
      }));
      this.checkSlug(correctValue);
    }
  };

  handleFocus = () => {
    this.setState({ isFocus: true });
  };

  handleBlur = () => {
    const { realSlug } = this.props;
    const { value, storeSlugExists } = this.state;
    this.setState({
      isFocus: false,
      value:
        realSlug === null && storeSlugExists && value ? '' : this.props.slug,
      storeSlugExists: null,
    });
    this.checkSlug.cancel();
  };

  render() {
    const { isFocus, value, storeSlugExists, errors } = this.state;
    return (
      <div styleName="container">
        <div styleName="input">
          <Input
            id="slug"
            fullWidth
            label="Web address"
            value={value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            errors={errors}
          />
          {isFocus &&
            storeSlugExists !== null && (
              <div
                styleName={classNames('light', {
                  green: !storeSlugExists,
                  red: storeSlugExists,
                })}
              >
                {storeSlugExists ? 'In use' : 'Vacant'}
              </div>
            )}
          {isFocus &&
            storeSlugExists !== null && (
              <div
                styleName={classNames('hint', {
                  green: !storeSlugExists,
                  red: storeSlugExists,
                })}
              >
                {storeSlugExists
                  ? 'Oops! Someone has already using this address.'
                  : 'Hoorah! Name is vacant!'}
              </div>
            )}
        </div>
        <div styleName="domen">
          <span>.storiqa.com</span>
        </div>
      </div>
    );
  }
}

export default createRefetchContainer(
  InputSlug,
  graphql`
    fragment InputSlug_storeSlugExists on Query
      @argumentDefinitions(slug: { type: "String!", defaultValue: "" }) {
      id
      storeSlugExists(slug: $slug)
    }
  `,
  graphql`
    query InputSlug_Query($slug: String!) {
      ...InputSlug_storeSlugExists @arguments(slug: $slug)
    }
  `,
);

// export default InputSlug;
