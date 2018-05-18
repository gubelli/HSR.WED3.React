// @flow

import React from 'react';
import {Col, Container, Row} from "reactstrap";
import Payment from "../../components/payment/payment";
import Transaction from "../../components/transaction/transaction";

class Dashboard extends React.Component<{}, *> {
    render () {
        return (
            <Container fluid>
                <Row>
                    <Col><Payment/></Col>
                    <Col><Transaction/></Col>
                </Row>
            </Container>
        );
    }
}

export default Dashboard;
