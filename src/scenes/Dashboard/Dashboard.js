// @flow

import React from 'react';
import {Col, Container, Row} from "reactstrap";
import Payment from "../../components/Payment/Payment";
import TransactionTable from "../../components/Transaction-Table/Transaction-Table";
import * as api from "../../services/api";

const COUNT_LATEST_TRANSACTIONS = 3;

class Dashboard extends React.Component<{}, *> {

    constructor(){
        super();
        const token = localStorage.getItem ('token');
        this.state = {
            token: token,
            transactions: []
        };
    }

    componentDidMount() {
        this.getTransactions(this.state.token, COUNT_LATEST_TRANSACTIONS);
    }

    getTransactions = (token: string, count: number) => {
        api.getTransactions(token,"","",count)
            .then( (result) => {
                const transactions = result.result;
                this.setState({transactions});
            })
            .catch((error) => console.error(error))
    };

    handleNewPayment = () => {
        this.getTransactions(this.state.token, COUNT_LATEST_TRANSACTIONS);
    };

    render () {
        return (
            <Container fluid>
                <Row>
                    <Col><Payment onNewPayment={this.handleNewPayment}/></Col>
                    <Col><TransactionTable transactions={this.state.transactions}
                                           title={"Latest transactions"} button={true}/></Col>
                </Row>
            </Container>
        );
    }
}

export default Dashboard;
