// @flow

import React from 'react';
import {Card, CardBody, CardHeader, Table} from "reactstrap";

class Transaction extends React.Component<{}, *> {

    render () {

        const rows =
            this.props.transactions.map((transaction, index ) => this.renderTransactionRow(transaction, index));

        return (
            <Card>
                <CardHeader><h1>Latest transactions</h1></CardHeader>
                <CardBody>
                    <Table>
                        <thead>
                        <tr>
                            <th>Source</th>
                            <th>Target</th>
                            <th>Amount [CHF]</th>
                            <th>Balance [CHF]</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        );
    }

    renderTransactionRow = (transaction, index) => {
        return (
            <tr key={index}>
                <td>{transaction.from}</td>
                <td>{transaction.target}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.total}</td>
            </tr>
        );
    };
}

export default Transaction;