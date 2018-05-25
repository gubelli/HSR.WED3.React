// @flow

import React from 'react';
import {Redirect} from 'react-router-dom';
import {
    Input,
    Button,
    Alert,
    FormGroup,
    FormFeedback,
    Row,
    Col,
    Form,
    Label,
    Container,
    Card,
    CardHeader, CardBody
} from 'reactstrap';

import {signup} from '../../services/api';
import './Signup.css';

class Signup extends React.Component<{}, *> {
    state = {
        login: '',
        firstname: '',
        lastname: '',
        password: '',
        passwordConfirmation: '',
        error: null,
        redirectToReferrer: false,
        touched: {
            login: false,
            firstname: false,
            lastname: false,
            password: false,
            passwordConfirmation: false
        }
    };

    handleLoginChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({login: event.target.value});
        }
    };

    handleFirstNameChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({firstname: event.target.value});
        }
    };

    handleLastNameChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({lastname: event.target.value});
        }
    };

    handlePasswordChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState ({password: event.target.value});
        }
    };

    handlePasswordConfirmationChanged = (event: Event) => {
        if (event.target instanceof  HTMLInputElement) {
            this.setState ({passwordConfirmation: event.target.value});
        }
    };

    handleSubmit = (event: Event) => {
        event.preventDefault ();
        const {login, firstname, lastname, password} = this.state;
        signup (login, firstname, lastname, password)
            .then (() => {
                this.props.authenticate (login, password, error => {
                    if (error) {
                        this.setState ({error});
                    } else {
                        this.setState ({redirectToReferrer: true, error: null});
                    }
                });
            })
            .catch (error => this.setState ({error}));
    };

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    };

    validate = (login: string, password: string, passwordConfirmation: string, firstname: string, lastname: string) => {
        return {
            login: login.length >= 3,
            password: password.length >= 3,
            passwordConfirmation: password && password === passwordConfirmation,
            firstname: firstname.length >= 3,
            lastname: lastname.length >= 3
        };
    };

    render () {
        const {redirectToReferrer, error} = this.state;

        if (redirectToReferrer) {
            return <Redirect to="/dashboard" />;
        }

        const errors = this.validate (
            this.state.login,
            this.state.password,
            this.state.passwordConfirmation,
            this.state.firstname,
            this.state.lastname);

        const shouldShowError = (field) => {
            const hasError = !errors[field];
            const shouldShow = this.state.touched[field];
            return hasError ? shouldShow : false;
        };


        const formValid = !Object.keys(errors).some(x => !errors[x]);

        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader><h1>Welcome to the bank of Rapperswil</h1></CardHeader>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <Label for="firstname">Firstname</Label>
                                            <Input
                                                onChange={this.handleFirstNameChanged}
                                                onBlur={this.handleBlur('firstname')}
                                                placeholder="First name"
                                                value={this.state.firstname}
                                                invalid={shouldShowError('firstname')}
                                                valid={errors.firstname}
                                            />
                                            <FormFeedback>Please specify your first name.</FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="lastname">Lastname</Label>
                                            <Input
                                                onChange={this.handleLastNameChanged}
                                                onBlur={this.handleBlur('lastname')}
                                                placeholder="Last name"
                                                value={this.state.lastname}
                                                invalid={shouldShowError('lastname')}
                                                valid={errors.lastname}
                                            />
                                            <FormFeedback>Please specify your last name.</FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="login">User name</Label>
                                            <Input
                                                onChange={this.handleLoginChanged}
                                                onBlur={this.handleBlur('login')}
                                                placeholder="User"
                                                value={this.state.login}
                                                invalid={shouldShowError('login')}
                                                valid={errors.login}
                                            />
                                            <FormFeedback>Please specify your login, at least three characters.</FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="password">Password</Label>
                                            <Input
                                                onChange={this.handlePasswordChanged}
                                                onBlur={this.handleBlur('password')}
                                                placeholder="Password"
                                                type="password"
                                                id="password"
                                                value={this.state.password}
                                                invalid={shouldShowError('password')}
                                                valid={errors.password}
                                            />
                                            <FormFeedback>Please specify your password, at least 3 characters</FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="confirmpassword">Confirm Password</Label>
                                            <Input
                                                onChange={this.handlePasswordConfirmationChanged}
                                                onBlur={this.handleBlur('passwordConfirmation')}
                                                placeholder="Password"
                                                type="password"
                                                id="confirmpassword"
                                                value={this.state.passwordConfirmation}
                                                invalid={shouldShowError('passwordConfirmation')}
                                                valid={errors.passwordConfirmation}
                                            />
                                            <FormFeedback>Please confirm your password</FormFeedback>
                                        </FormGroup>
                                        <Button color="primary" onClick={this.handleSubmit} disabled={!formValid}>
                                            Login
                                        </Button>
                                        {error &&
                                        <Alert color="warning" error>
                                            An error occurred!
                                        </Alert>}
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Signup;
