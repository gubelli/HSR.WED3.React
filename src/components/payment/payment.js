// @flow

import React from 'react';
import {Button, Card, CardBody, CardHeader, Form, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import type {Account, AccountNr} from "../../services/api";
import * as api from "../../services/api";

type State = {
    token: string,
    account: Account
}

class Payment extends React.Component<{}, State> {
    constructor (props: any) {
        super(props);
        const token = sessionStorage.getItem ('token');
        this.state = {
            token: token,
            account: {
                accountNr: '',
                amount: 0
            },
            targetAccount: null,
            targetAccountNr: 0,
            amount: 0,
            error: undefined
        };
    }

    componentDidMount() {
        this.getOwnAccount(this.state.token);
    }

    getOwnAccount = (token: string) => {
        api.getAccountDetails(token)
            .then( (account) => this.setState({account}))
            .catch (error => this.setState ({error}));
    };

    getTargetAccount = (accountNr: AccountNr, token: string) => {
        api.getAccount(accountNr, token)
            .then( (targetAccount) => this.setState({targetAccount}))
            .catch(error => this.setState ({error}))
    };

    handleTargetChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({target: event.target.value});
        }
    };

    handleAmountChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({amount: event.target.value});
        }
    };

    handleSubmit = (event: Event) => {
        event.preventDefault ();
        console.log("Form submitted");
    };

    validate = (target: number, amount: number) => {
        return {
            target: target > 10000,
            amount: amount >= 0.05,
        };
    };

    render () {

        const errors = this.validate(this.state.target, this.state.amount);

        const formValid = errors.amount & errors.target;

        return (
            <Card>
                <CardHeader><h1>New payment</h1></CardHeader>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="from">From</Label>
                            <Input
                                id="from"
                                value={this.state.account.accountNr + ` [${this.state.account.amount.toFixed(2)} CHF]`}
                                disabled
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="target">To</Label>
                            <Input
                                onChange={this.handleTargetChanged}
                                type="text"
                                placeholder="Target account number"
                                id="target"
                                value={this.state.target}
                                invalid={!errors.target}
                            />
                            <FormFeedback>Please specify the target account number.</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="target">Amount [CHF]</Label>
                            <Input
                                onChange={this.handleAmountChanged}
                                type="number"
                                placeholder="Amount in CHF"
                                id="amount"
                                value={this.state.amount}
                                invalid={!errors.amount}
                            />
                            <FormFeedback>Please specify the amount.</FormFeedback>
                        </FormGroup>
                        <Button color="primary" onClick={this.handleSubmit} disabled={!formValid}>
                            Pay
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}

export default Payment;