// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import { Input } from 'components/common/Input';
import { Checkbox } from 'components/common/Checkbox';
import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';

import Modal from '../pages/Manage/Wizard/Step3/Modal';
import './WindowModal.scss';

type StateType = {
  showModal: boolean,
  isDone: boolean,
  form: {
    email: {
      text: string,
      errors: ?Array<string>,
    },
    eth: {
      text: string,
      errors: ?Array<string>,
    },
    storageAccess: boolean,
    newsAccess: boolean,
  },
};

class WindowModal extends React.Component<{}, StateType> {
  state = {
    showModal: false,
    isDone: false,
    form: {
      email: {
        text: '',
        errors: null,
      },
      eth: {
        text: '',
        errors: null,
      },
      storageAccess: false,
      newsAccess: false,
    },
  };

  componentDidMount() {
    if (process.env.BROWSER) {
      window.showModal = () => {
        this.setState({ showModal: true });
      };
      window.closeModal = () => {
        this.setState({ showModal: false });
      };
      window.onDone = () => {
        this.setState({ isDone: true });
      };
    }
  }

  handleOnClose = () => {
    this.setState({ showModal: false });
  };

  handleChangeEmail = (e: any) => {
    const {
      target: { value },
    } = e;
    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailIsValid = emailReg.test(value);
    this.setState({
      ...this.state,
      form: {
        ...this.state.form,
        email: {
          text: value,
          errors: emailIsValid ? null : ['Invalid email'],
        },
      },
    });
  };

  handleChangeETH = (e: any) => {
    const {
      target: { value },
    } = e;
    const ethReg = /^0?[x|X]?[a-zA-Z0-9]{40}$/;
    // const clearValue =
    //   splitAt(2, value)[0] === '0x' ? splitAt(2, value)[1] : value;
    const ethIsValid = ethReg.test(value);
    if (value.length <= 42) {
      this.setState({
        ...this.state,
        form: {
          ...this.state.form,
          eth: {
            text: value,
            errors: ethIsValid ? null : ['Invalid wallet number'],
          },
        },
      });
    }
  };

  handleOnStorageChange = () => {
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        storageAccess: !prevState.form.storageAccess,
      },
    }));
  };

  handleOnNewsChange = () => {
    this.setState(prevState => ({
      ...prevState,
      form: {
        ...prevState.form,
        newsAccess: prevState ? !prevState.form.newsAccess : false,
      },
    }));
  };

  handleCB = () => {
    const { form } = this.state;
    const result = {
      email: form.email.text,
      eth: form.eth.text,
      storageAccess: form.storageAccess,
      newsAccess: form.newsAccess,
    };
    if (process.env.BROWSER) {
      window.cb(result);
    }
  };

  render() {
    const { showModal, form, isDone } = this.state;
    const newsLabel = (
      <span>
        I agree to my personal data being stored and used.
        <a
          styleName="policy"
          href="https://crowdsale.storiqa.com/static/docs/privacy_policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </span>
    );
    const checkValid = () => {
      if (
        !form.email.text ||
        !form.eth.text ||
        form.email.errors ||
        form.eth.errors
      ) {
        return false;
      }
      if (!form.newsAccess || !form.storageAccess) {
        return false;
      }
      return true;
    };
    return (
      <Modal showModal={showModal} onClose={this.handleOnClose} dark>
        {(isDone && (
          <div styleName="modalContainer success">
            <div styleName="modalTitle">
              Thank you for testing Storiqa’s beta version!
            </div>

            <div styleName="modalDescription">
              Make sure you left your email and wallet address, we inform you
              later when tokens will be distributed.
            </div>
            <div styleName="modalDescription">
              Join Telegram to get updates first!
              <a styleName="modalLink" href="https://t.me/storiqa_en">
                <Icon type="telegram" inline size={20} />{' '}
                https://t.me/storiqa_en
              </a>
            </div>
            <div styleName="buttonContainerDone">
              <Button onClick={this.handleOnClose} big wireframe>
                <span>Ok</span>
              </Button>
            </div>
          </div>
        )) || (
          <div styleName="modalContainer">
            <div styleName="modalTitle">
              Thank you for testing Storiqa’s beta version!
            </div>
            <div styleName="modalDescription">
              To participate in airdrop, leave your email & wallet number.
            </div>
            {/* <div styleName="modalDescription">
              Join Telegram to get updates first!
              <a styleName="modalLink" href="https://t.me/storiqa_en">
                <Icon type="telegram" inline size={20} />{' '}
                https://t.me/storiqa_en
              </a>
            </div> */}
            <div styleName="form">
              <div styleName="input">
                <Input
                  id="email"
                  value={form.email.text}
                  label="Email"
                  onChange={this.handleChangeEmail}
                  errors={form.email.errors}
                  fullWidth
                />
              </div>
              <div styleName="input">
                <Input
                  id="eth"
                  value={form.eth.text}
                  // value
                  label="ETH address"
                  onChange={this.handleChangeETH}
                  errors={form.eth.errors}
                  fullWidth
                />
              </div>
              <div styleName="checkboxContainer">
                <Checkbox
                  id="accessStorage"
                  label="I agree to receive informational newsletters and commercial offers about Storiqa."
                  isChecked={form.storageAccess}
                  onChange={this.handleOnStorageChange}
                />
              </div>
              <div styleName="checkboxContainer">
                <Checkbox
                  id="accessNews"
                  label={newsLabel}
                  isChecked={form.newsAccess}
                  onChange={this.handleOnNewsChange}
                />
              </div>
              <div styleName="buttonContainer">
                <Button
                  onClick={this.handleCB}
                  big
                  wireframe
                  disabled={!checkValid()}
                >
                  <span>Get your tokens</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  }
}

if (process.env.BROWSER) {
  ReactDOM.render(
    <WindowModal />,
    // $FlowIgnore
    document.getElementById('global-modal-root'),
  );
}
