// @flow

import React from 'react';
import {Button, Card, CardBody, CardHeader, Form, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import type {Account, AccountNr, TransferResult} from "../../services/api";
import * as api from "../../services/api";

type State = {
    token: string,
    account: Account
}

const TARGET_ACCOUNT_INVALID_FORMAT = "Please specify the target account number.";
const TARGET_ACCOUNT_UNKNOWN = "Unknown account number specified.";

class Payment extends React.Component<{}, State> {
    constructor (props: any) {
        super(props);
        const token = localStorage.getItem ('token');
        this.state = {
            token: token,
            account: {
                accountNr: '',
                amount: 0
            },
            targetAccount: null,
            targetAccountNr: '',
            targetDisplayText: TARGET_ACCOUNT_INVALID_FORMAT,
            transactionIsSucceeded: false,
            amount: 0,
            error: undefined,
            touched: {
                amount: false,
                targetAccountNr: false
            }
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
            .then( (targetAccount: Account) => {
                this.setState({targetAccount,
                    targetDisplayText: targetAccount.owner.firstname + ' ' + targetAccount.owner.lastname});
            })
            .catch(() => {
                this.setState ({targetDisplayText: TARGET_ACCOUNT_UNKNOWN, targetAccount: null});
            })
    };

    createTransaction = (target: AccountNr, amount: number, token: string) => {
        api.transfer(target, amount, token)
            .then((result: TransferResult) => {
                this.setState (prevState => ({
                    account: {
                        ...prevState.account,
                        amount: result.total
                    },
                    transactionIsSucceeded: true
                }));
                this.props.onNewPayment(result);
            })
    };

    handleTargetChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({targetAccountNr: event.target.value});
            this.validateTargetAccount(event.target.value);
        }
    };

    handleAmountChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({amount: event.target.value});
        }
    };

    handleSubmit = (event: Event) => {
        event.preventDefault ();
        this.createTransaction(this.state.targetAccountNr, this.state.amount, this.state.token);
    };

    handleStartOver = () => {
        this.setState ({
            targetAccount: null,
            targetAccountNr: '',
            transactionIsSucceeded: false,
            amount: 0,
            targetDisplayText: TARGET_ACCOUNT_INVALID_FORMAT
        })
    };


    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    };

    validate = (amount: number) => {
        return {
            amount: amount >= 0.05,
        };
    };

    validateTargetAccount = (targetAccountNr: AccountNr) => {
        if(targetAccountNr.length === 7 && targetAccountNr !== this.state.account.accountNr){
            this.getTargetAccount(targetAccountNr, this.state.token);
        }else{
            this.setState ({targetDisplayText: TARGET_ACCOUNT_INVALID_FORMAT, targetAccount: null});
        }
    };

    render ()
    {
        const errors = this.validate(this.state.amount);

        const formValid = errors.amount & this.state.targetAccount !== null;

        return (
            <Card>
                <CardHeader><h1>New payment</h1></CardHeader>
                <CardBody>
                    <Form hidden={this.state.transactionIsSucceeded}>
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
                                onBlur={this.handleBlur('targetAccountNr')}
                                type="number"
                                placeholder="Target account number"
                                id="target"
                                value={this.state.targetAccountNr}
                                invalid={this.state.targetAccount === null && this.state.touched.targetAccountNr}
                                valid={this.state.targetAccount !== null}
                            />
                            <FormFeedback>{this.state.targetDisplayText}</FormFeedback>
                            <FormFeedback valid>{this.state.targetDisplayText}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="target">Amount [CHF]</Label>
                            <Input
                                onChange={this.handleAmountChanged}
                                onBlur={this.handleBlur('amount')}
                                type="number"
                                placeholder="Amount in CHF"
                                min="0"
                                id="amount"
                                value={this.state.amount}
                                invalid={!errors.amount && this.state.touched.amount}
                                valid={errors.amount}
                            />
                            <FormFeedback>Please specify the amount.</FormFeedback>
                        </FormGroup>
                        <Button color="primary" onClick={this.handleSubmit} disabled={!formValid}>
                            Pay
                        </Button>
                    </Form>
                    <div hidden={!this.state.transactionIsSucceeded}>
                        <p>Transaction to {this.state.targetAccountNr} succeeded!</p>
                        <p>New balance {this.state.account.amount.toFixed(2)} CHF</p>
                        <Button color="primary" onClick={this.handleStartOver}>
                            Start over
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default Payment;