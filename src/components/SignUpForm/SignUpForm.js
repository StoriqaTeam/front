// @flow

import React, { PureComponent } from 'react';

import GoogleIcon from 'assets/svg/google-icon.svg';
import FacebookIcon from 'assets/svg/facebook-icon.svg';

import { Form } from 'components/Form';
import { FormHeader } from 'components/FormHeader';
import { FormInput } from 'components/FormInput';
import { FormGroup } from 'components/FormGroup';
import { Button } from 'components/Button';
import { Separator } from 'components/Separator';
import './SignUpForm.scss';

type StateType = {
  username: string,
  usernameValid: boolean,
  email: string,
  emailValid: boolean,
  passwordValid: boolean,
  formValid: boolean
}

class SignUpForm extends PureComponent<{}, StateType> {
  state: StateType = {
    username: '',
    usernameValid: false,
    email: '',
    emailValid: false,
    password: '',
    passwordValid: false,
    formValid: false,
  };
  /**
   * @desc Storiqa's anti-span policy
   * @type {String}
   */
  policy = (
    <span styleName="policy">
      <small styleName="policyAgreement">By clicking this button, you agree to Storiqa’s </small>
      <small styleName="policyAntiSpam">Anti-spam Policy & Terms of Use.</small>
    </span>
  );
  /**
   * @desc handles onSubmit event
   */
  handleSubmit = () => {
    // eslint-disable-next-line
    console.log('submited');
  };
  /**
   * @desc handles onChange event by setting the validity of the desired input
   * @param {SyntheticEvent} evt
   * @param {String} evt.name
   * @param {any} evt.value
   * @param {Boolean} evt.validity
   * @return {void}
   */
  handleChange = ({ name, value, validity }) => {
    this.setState({ [name]: value, [`${name}Valid`]: validity }, () => this.validateForm());
  };
  /**
   * @desc Validates the form based on its values
   * @return {void}
   */
  validateForm = () => {
    const { usernameValid, emailValid, passwordValid } = this.state;
    this.setState({ formValid: usernameValid && emailValid && passwordValid });
  };
  /**
   * @desc handles handleProviderAuth event
   */
  handleProviderAuth = () => {};

  render() {
    const {
      username,
      email,
      password,
      formValid,
    } = this.state;
    const singUp = (
      <div styleName="signUpGroup">
        <Button
          type="submit"
          buttonClass="signUp"
          title="Sign Up"
          onClick={this.handleSubmit}
        />
        { this.policy }
      </div>
    );
    // Show only when the form is valid
    const singUpContent = formValid ? singUp : null;
    return (
      <Form
        wrapperClass="auth"
        onSubmit={this.handleSubmit}
      >
        <FormHeader
          title="Sign Up"
          linkTitle="Sign In"
        />
        <FormGroup>
          <FormInput
            label="Username"
            name="username"
            type="text"
            model={username}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormInput
            label="Email"
            name="email"
            type="email"
            model={email}
            validate="email"
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormInput
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            showHints
            onChange={this.handleChange}
          />
        </FormGroup>
        { singUpContent }
        <Separator text="or" />
        <FormGroup marginBottom={24}>
          <GoogleIcon styleName="providerIcon" />
          <Button
            buttonClass="buttonProvider"
            title="Sign up with Google"
            onClick={this.handleProviderAuth}
          />
        </FormGroup>
        <FormGroup marginBottom={24}>
          <FacebookIcon styleName="providerIcon" />
          <Button
            buttonClass="buttonProvider"
            title="Sign up with Facebook"
            onClick={this.handleProviderAuth}
          />
        </FormGroup>
      </Form>
    );
  }
}

export default SignUpForm;
