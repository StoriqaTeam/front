// @flow strict

import React, { Component } from 'react';
import classNames from 'classnames';
import { graphql } from 'react-relay';
import { fetchQuery } from 'relay-runtime';
import debounce from 'lodash.debounce';

import { environment } from 'relay/createResolver';
import { Input } from 'components/common/Input';

import './InputSlug.scss';

type PropsType = {
  slug: string,
  onChange: (value: string) => void,
  errors?: ?Array<string>, // eslint-disable-line
};

type StateType = {
  isFocus: boolean,
  value: string,
  isSlugExists: ?boolean,
  isInProcess: boolean,
  errors?: ?Array<string>,
};

class InputSlug extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
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

    this.checkSlug = debounce(this.checkSlug, 500);
  }

  state: StateType = {
    isFocus: false,
    value: this.props.slug,
    isSlugExists: null,
    isInProcess: false,
    errors: null,
  };

  checkSlugPromise = (value: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
      fetchQuery(
        environment,
        graphql`
          query InputSlug_Query($slug: String!) {
            storeSlugExists(slug: $slug)
          }
        `,
        {
          slug: value,
        },
      )
        .then(data => {
          if (data && data.storeSlugExists != null) {
            resolve(!!data.storeSlugExists);
          }
          reject(new Error('Some shit happens'));
        })
        .catch(err => reject(err));
    });

  checkSlug = (value: string) => {
    this.checkSlug.cancel();
    this.setState({ isInProcess: true }, () => {
      this.checkSlugPromise(value)
        .then(isExists => {
          this.setState({ isSlugExists: isExists });
        })
        .finally(() => {
          this.setState({ isInProcess: false });
        });
    });
  };

  handleChange = (e: { target: { value: string } }) => {
    const { value: prevValue } = this.state;
    const correctedValue = e.target.value
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

    if (correctedValue === '') {
      this.checkSlug.cancel();
      this.setState({
        value: correctedValue,
        isSlugExists: null,
      });
      this.props.onChange(correctedValue);
      return;
    }

    if (prevValue !== correctedValue) {
      this.setState(
        {
          value: correctedValue,
          isSlugExists: null,
        },
        () => {
          this.props.onChange(correctedValue);
          this.checkSlug(correctedValue);
        },
      );
    }
  };

  handleFocus = () => {
    this.setState({ isFocus: true });
  };

  handleBlur = () => {
    this.setState({
      isFocus: false,
      isSlugExists: null,
    });
  };

  render() {
    const { isFocus, value, isSlugExists, errors, isInProcess } = this.state;
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
            disabled={isInProcess}
          />
          {isFocus &&
            isSlugExists !== null && (
              <React.Fragment>
                <div
                  styleName={classNames('light', {
                    green: !isSlugExists,
                    red: isSlugExists,
                  })}
                >
                  {isSlugExists != null && Boolean(isSlugExists)
                    ? 'In use'
                    : 'Vacant'}
                </div>
                <div
                  styleName={classNames('hint', {
                    green: !isSlugExists,
                    red: isSlugExists,
                  })}
                >
                  {isSlugExists != null && Boolean(isSlugExists)
                    ? 'Oops! Someone has already using this address.'
                    : 'Hoorah! Name is vacant!'}
                </div>
              </React.Fragment>
            )}
        </div>
        <div styleName="domen">
          <span>.storiqa.com</span>
        </div>
      </div>
    );
  }
}

export default InputSlug;
