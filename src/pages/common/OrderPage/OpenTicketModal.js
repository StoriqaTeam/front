// @flow strict

import React, { Component } from 'react';
import axios from 'axios';

import { Input, Textarea, Button } from 'components/common';

import './OpenTicketModal.scss';

type StateType = {
  ticketTitleText: string,
  ticketProblemText: string,
};

type PropsType = {
  //
};

class OpenTicketModal extends Component<PropsType, StateType> {
  state = {
    ticketTitleText: '',
    ticketProblemText: '',
  };

  handleTicketTitleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState({ ticketTitleText: value });
  };

  handleTicketProblemChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState({ ticketProblemText: value });
  };

  handleCreateTicket = () => {
    const api = axios.create({
      baseURL: 'https://storiqa.zendesk.com',
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: 'p.bokaj@storiqa.com',
        password: 'ExtraThicc420',
      },
    });
    const { ticketTitleText, ticketProblemText } = this.state;
    api.post('/api/v2/tickets.json', {
      ticket: {
        subject: ticketTitleText,
        comment: { body: ticketProblemText },
      },
    })
    .then(data => {
      console.log('---data', data);
    })
    .catch(error => {
      console.log(error);
    });
  };

  render() {
    const { ticketTitleText, ticketProblemText } = this.state;
    return (
      <div styleName="container">
        <div styleName="title">
          <thin>Support</thin>
        </div>
        <div styleName="ticketTitle">
          <Input
            fullWidth
            value={ticketTitleText}
            label="Ticket title"
            onChange={this.handleTicketTitleChange}
            limit={50}
          />
        </div>
        <div styleName="ticketText">
          <Textarea
            fullWidth
            value={ticketProblemText}
            label="Your problem"
            onChange={this.handleTicketProblemChange}
          />
        </div>
        <div styleName="createTicketButton">
          <Button
            big
            inline
            onClick={this.handleCreateTicket}
          >
            Create ticket
          </Button>
        </div>
      </div>
    );
  }
}

export default OpenTicketModal;
