// @flow

import React from 'react';
import {Card, CardBody, CardHeader, CardText} from "reactstrap";

class Transaction extends React.Component<{}, *> {
    render () {
        return (
            <Card>
                <CardHeader><h1>Latest transactions</h1></CardHeader>
                <CardBody>
                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                </CardBody>
            </Card>
        );
    }
}

export default Transaction;