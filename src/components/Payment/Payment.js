// @flow

import React from 'react';
import {Button, Card, CardBody, CardHeader, Form, FormFeedback, FormGroup, Input, Label} from "reactstrap";
import type {Account, AccountNr, TransferResult} from "../../services/api";
import * as api from "../../services/api";
import FormComponent from "../../utils/Form";

const TARGET_ACCOUNT_INVALID_FORMAT = "Please specify the target account number.";
const TARGET_ACCOUNT_UNKNOWN = "Unknown account number specified.";

class Payment extends FormComponent<{}, *> {
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
            pristine: {
                amount: true,
                targetAccountNr: true
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
        const target = event.target;
        const name = target.id;

        if (target instanceof HTMLInputElement) {
            const value = target.value;
            this.setState (prevState => ({
                pristine: {
                    ...prevState.pristine,
                    [name]: false
                },
                targetAccountNr: value
            }));

            this.validateTargetAccount(value);
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
            targetDisplayText: TARGET_ACCOUNT_INVALID_FORMAT,
            pristine: {
                amount: true,
                targetAccountNr: true
            }
        })
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
                            <Label for="targetAccountNr">To</Label>
                            <Input
                                id="targetAccountNr"
                                onChange={this.handleTargetChanged}
                                type="number"
                                placeholder="Target account number"
                                value={this.state.targetAccountNr}
                                invalid={this.state.targetAccount === null && !this.state.pristine.targetAccountNr}
                                valid={this.state.targetAccount !== null}
                            />
                            <FormFeedback>{this.state.targetDisplayText}</FormFeedback>
                            <FormFeedback valid>{this.state.targetDisplayText}</FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="target">Amount [CHF]</Label>
                            <Input
                                id="amount"
                                onChange={this.handleChangeEvent}
                                type="number"
                                placeholder="Amount in CHF"
                                min="0"
                                value={this.state.amount}
                                invalid={!errors.amount && !this.state.pristine.amount}
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