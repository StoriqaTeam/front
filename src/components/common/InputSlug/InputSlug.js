// @flow strict

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { Environment } from 'relay-runtime';

import { ContextDecorator } from 'components/App';
import debounce from 'lodash.debounce';
import { Input } from 'components/common/Input';
import fetchStoreSlugExists from './fetchStoreSlugExists';

import './InputSlug.scss';

import t from './i18n';

type PropsType = {
  slug: string,
  realSlug: string,
  onChange: (value: ?string) => void,
  environment: Environment,
};

type StateType = {
  isFocus: boolean,
  value: string,
  storeSlugExists: ?boolean,
  incorrectFormat: boolean,
  serverError: boolean,
};

class InputSlug extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isFocus: false, // eslint-disable-line
      value: props.slug,
      storeSlugExists: null,
      incorrectFormat: false,
      serverError: false,
    };

    this.checkSlug = debounce(this.checkSlug, 250);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted: boolean = false;

  checkSlug = (slugValue: string) => {
    if (!slugValue) {
      this.setState(
        {
          storeSlugExists: null,
        },
        () => {
          this.props.onChange(null);
        },
      );
      return;
    }

    if (/-$/i.test(slugValue)) {
      this.setState(
        {
          incorrectFormat: true,
        },
        () => {
          this.props.onChange(null);
        },
      );
      return;
    }

    const { realSlug } = this.props;
    if (realSlug && realSlug === slugValue) {
      return;
    }

    fetchStoreSlugExists(this.props.environment, { slug: slugValue })
      .then(({ storeSlugExists }) => {
        if (!this.mounted) {
          return true;
        }
        if (!storeSlugExists) {
          this.setState(
            prevState => ({
              storeSlugExists:
                prevState.storeSlugExists !== false && prevState.isFocus
                  ? false
                  : null,
            }),
            () => {
              this.props.onChange(slugValue);
            },
          );
        } else {
          this.setState({ storeSlugExists: true }, () => {
            this.props.onChange(null);
          });
        }
        return true;
      })
      .catch(() => {
        this.setState({ serverError: true });
      });
  };

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      incorrectFormat: false,
      storeSlugExists: null,
      serverError: false,
    });
    const { value } = e.target;
    const correctValue = value
      .toString()
      .toLowerCase()
      // Replace spaces with -
      .replace(/\s+/g, '-')
      // Replace multiple - with single -
      .replace(/(\-\-)+/g, '-') // eslint-disable-line
      // Trim - from start of text
      .replace(/^-+/, '')
      // Only english letters
      .replace(/[^-a-z]/gim, '');
    this.setState(
      {
        value: correctValue,
        storeSlugExists: null,
      },
      () => {
        this.checkSlug(correctValue);
      },
    );
  };

  handleFocus = () => {
    this.setState({ isFocus: true }); // eslint-disable-line
  };

  handleBlur = () => {
    this.setState((prevState: StateType) => ({
      isFocus: false,
      storeSlugExists:
        prevState.storeSlugExists === false ? null : prevState.storeSlugExists,
    }));
  };

  render() {
    const { value, storeSlugExists, incorrectFormat, serverError } = this.state;
    const errors =
      storeSlugExists === true || incorrectFormat || serverError ? [] : null;
    return (
      <div styleName="container">
        <div styleName="input">
          <Input
            id="slug"
            fullWidth
            label={
              <span>
                {t.labelWebAddress} <span styleName="asterisk">*</span>
              </span>
            }
            value={value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            errors={errors}
          />
          {storeSlugExists !== null && (
            <Fragment>
              <div
                styleName={classNames('light', {
                  green: !storeSlugExists,
                  red: storeSlugExists,
                })}
              >
                {storeSlugExists === true ? t.inUse : t.vacant}
              </div>
              <div
                styleName={classNames('hint', {
                  green: !storeSlugExists,
                  red: storeSlugExists,
                })}
              >
                {storeSlugExists === true ? t.oops : t.hoorah}
              </div>
            </Fragment>
          )}
          {incorrectFormat && (
            <Fragment>
              <div styleName="light red">Oops</div>
              <div styleName="hint red">{t.incorrectFormat}</div>
            </Fragment>
          )}
          {serverError && (
            <Fragment>
              <div styleName="light red">Oops</div>
              <div styleName="hint red">{t.serverError}</div>
            </Fragment>
          )}
        </div>
        <div styleName="domen">
          <span>.storiqa.com</span>
        </div>
      </div>
    );
  }
}

export default ContextDecorator(InputSlug);
