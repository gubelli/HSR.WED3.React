// @flow

import React from 'react';
import {Col, Container, Form, FormGroup, Input, Label, Row} from "reactstrap";
import TransactionTable from "../../components/Transaction-Table/Transaction-Table";
import * as api from "../../services/api";

class AllTransactions extends React.Component<{}, *> {

    yearList;
    monthList = ['January', 'February', 'March', 'April', 'Mai',
        'June', 'Juli', 'August', 'October', 'November', 'December'];

    constructor(){
        super();
        const token = localStorage.getItem ('token');
        const today = new Date();
        this.state = {
            token: token,
            transactions: [],
            month: today.getMonth(),
            year: today.getFullYear()
        };
        this.yearList = [this.state.year, this.state.year - 1, this.state.year - 2];
    }

    componentDidMount() {
        this.calculateTimeSpan(this.state.year, this.state.month);
    }

    getTransactions = (token: string, from: Date, to: Date) => {
        api.getTransactions(token, from, to, 0, 0)
            .then( (result) => {
                const transactions = result.result;
                this.setState({transactions});
            })
            .catch((error) => console.error(error))
    };

    handleYearChanged = (event: Event) => {
        if (event.target instanceof HTMLSelectElement) {
            this.calculateTimeSpan(+event.target.value, this.state.month);
        }
    };

    handleMonthChanged = (event: Event) => {
        if (event.target instanceof HTMLSelectElement) {
            this.calculateTimeSpan(this.state.year, +event.target.value);
        }
    };

    calculateTimeSpan = (year: number, month: number) => {
        this.setState ({year, month});

        const from = new Date(year, month, 1);
        const to = new Date(year, month + 1, 0, 23, 59, 59);

        this.getTransactions(this.state.token, from, to);
    };

    render () {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <TransactionTable transactions={this.state.transactions}
                                          title={"All transactions"} button={false}>
                            <h3>Filter</h3>
                            <Form>
                                <FormGroup row>
                                    <Col sm={4}>
                                        <Label for="year">Select a year</Label>
                                        <Input
                                            type="select"
                                            name="year" id="year"
                                            onChange={this.handleYearChanged}
                                            value={this.state.year}>
                                            {
                                                this.yearList.map( (year, index) =>
                                                    <option value={year} key={index}>{year}</option>)
                                            }
                                        </Input>
                                    </Col>
                                    <Col sm={8}>
                                        <Label for="month">Select a month</Label>
                                        <Input
                                            type="select"
                                            name="month"
                                            id="month"
                                            onChange={this.handleMonthChanged}
                                            value={this.state.month}>
                                            {
                                                this.monthList.map((month, index) =>
                                                    <option value={index} key={index}>{month}</option>)
                                            }
                                        </Input>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </TransactionTable>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default AllTransactions;
