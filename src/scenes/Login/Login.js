// @flow

import React from 'react';
import {Redirect} from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Input,
    Button,
    Form,
    FormGroup,
    Label,
    Alert,
    FormFeedback, Card, CardHeader, CardBody
} from 'reactstrap';
import './Login.css';

export type Props = {
  /* Callback to submit an authentication request to the server */
  authenticate:  (
    login: string,
    password: string,
    callback:  (error: ?Error) => void
  ) => void,
  /* We need to know what page the user tried to access so we can 
     redirect after logging in */
  location: {
    state?: {
      from: string,
    },
  },
};

class Login extends React.Component<Props, *> {
  state = {
    login: '',
    password: '',
    error: undefined,
    redirectToReferrer: false,
      touched: {
        login: false,
          password: false
      }
  };

  handleLoginChanged = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState ({login: event.target.value});
    }
  };

  handlePasswordChanged = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      this.setState ({password: event.target.value});
    }
  };

  handleSubmit = (event: Event) => {
    event.preventDefault ();
    const {login, password} = this.state;
    this.props.authenticate (login, password, error => {
      if (error) {
        this.setState ({error});
      } else {
        this.setState ({redirectToReferrer: true, error: null});
      }
    });
  };

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    };

  validate = (login: string, password: string) => {
    return {
      login: login.length >= 3,
      password: password.length >= 3,
    };
  };

  render () {
    const {from} = this.props.location.state || {
      from: {pathname: '/dashboard'},
    };
    const {redirectToReferrer, error} = this.state;

    const errors = this.validate (this.state.login, this.state.password);

    const shouldShowError = (field) => {
        const hasError = !errors[field];
        const shouldShow = this.state.touched[field];
        return hasError ? shouldShow : false;
    };

    const formValid = !Object.keys(errors).some(x => !errors[x]);

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

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
                                <Label for="username">Username</Label>
                                <Input
                                    onChange={this.handleLoginChanged}
                                    onBlur={this.handleBlur('login')}
                                    placeholder="Username"
                                    id="username"
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
                                <FormFeedback>Please specify your password, at least three characters.</FormFeedback>
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

export default Login;
