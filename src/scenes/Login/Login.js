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
  FormFeedback,
} from 'reactstrap';
import './Login.css';
import Header from '../../components/Header/Header';

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

  validate (login: string, password: string) {
    return {
      login: login.length >= 3,
      password: password.length >= 3,
    };
  }

  render () {
    const {from} = this.props.location.state || {
      from: {pathname: '/dashboard'},
    };
    const {redirectToReferrer, error} = this.state;

    const errors = this.validate (this.state.login, this.state.password);

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <Header />
        <Container>
          <Row>
            <Col>
              <h1>Welcome to the bank of Rapperswil</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <Label for="username">Username</Label>
                  <Input
                    onChange={this.handleLoginChanged}
                    placeholder="Username"
                    id="username"
                    value={this.state.login}
                    invalid={!errors.login}
                  />
                  <FormFeedback>At least 3 characters</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    onChange={this.handlePasswordChanged}
                    placeholder="Password"
                    type="password"
                    id="password"
                    value={this.state.password}
                    invalid={!errors.password}
                  />
                  <FormFeedback>At least 3 characters</FormFeedback>
                </FormGroup>
                <Button color="primary" onClick={this.handleSubmit}>
                  Login
                </Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              {error &&
                <Alert color="warning" error>
                  Es ist ein Fehler aufgetreten!
                </Alert>}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
