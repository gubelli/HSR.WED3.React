// @flow

import React from 'react';
import {Button, Card, CardBody, CardHeader, Table} from "reactstrap";
import {withRouter} from "react-router-dom";

class TransactionTable extends React.Component<{}, *> {

    render () {

        const rows =
            this.props.transactions.map((transaction, index ) => this.renderTransactionRow(transaction, index));

        const LinkButton = withRouter(({ history }) => (
            <Button color="primary" onClick={() => { history.push('/transactions') }}>
                All transactions
            </Button>
        ));

        return (
            <Card>
                <CardHeader><h1>{this.props.title}</h1></CardHeader>
                <CardBody>
                    {this.props.children}
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
                    {
                        this.props.button ? <LinkButton/> : ""
                    }

                </CardBody>
            </Card>
        );
    }

    renderTransactionRow = (transaction, index) => {
        return (
            <tr key={index}>
                <td>{transaction.from}</td>
                <td>{transaction.target}</td>
                <td>{transaction.amount.toFixed(2)}</td>
                <td>{transaction.total.toFixed(2)}</td>
            </tr>
        );
    };
}

export default TransactionTable;