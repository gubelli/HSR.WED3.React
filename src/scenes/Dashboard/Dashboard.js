// @flow

import React from 'react';
import {Col, Container, Row} from "reactstrap";
import Payment from "../../components/payment/payment";
import Transaction from "../../components/transaction/transaction";
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

    render () {
        return (
            <Container fluid>
                <Row>
                    <Col><Payment/></Col>
                    <Col><Transaction transactions={this.state.transactions}/></Col>
                </Row>
            </Container>
        );
    }
}

export default Dashboard;
