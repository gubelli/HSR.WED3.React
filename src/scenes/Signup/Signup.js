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
import FormComponent from "../../utils/Form";

class Signup extends FormComponent<{},*> {
    state = {
        login: '',
        firstname: '',
        lastname: '',
        password: '',
        passwordConfirmation: '',
        error: null,
        redirectToReferrer: false,
        pristine: {
            login: true,
            firstname: true,
            lastname: true,
            password: true,
            passwordConfirmation: true
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
            const shouldShow = !this.state.pristine[field];
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
                                                id="firstname"
                                                onChange={this.handleChangeEvent}
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
                                                id="lastname"
                                                onChange={this.handleChangeEvent}
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
                                                id="login"
                                                onChange={this.handleChangeEvent}
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
                                                id="password"
                                                onChange={this.handleChangeEvent}
                                                placeholder="Password"
                                                type="password"
                                                value={this.state.password}
                                                invalid={shouldShowError('password')}
                                                valid={errors.password}
                                            />
                                            <FormFeedback>Please specify your password, at least 3 characters</FormFeedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="passwordConfirmation">Confirm Password</Label>
                                            <Input
                                                id="passwordConfirmation"
                                                onChange={this.handleChangeEvent}
                                                placeholder="Password"
                                                type="password"
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
