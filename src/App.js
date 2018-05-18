// @flow

import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    withRouter,
} from 'react-router-dom';

import Login from './scenes/Login/Login';
import Signup from './scenes/Signup/Signup';

import PrivateRoute from './services/PrivateRoute';

import * as api from './services/api';

import './App.css';

import type {User} from './services/api';
import {Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from "reactstrap";
import NavLink from "react-router-dom/es/NavLink";
import Dashboard from "./scenes/Dashboard/Dashboard";
import {Redirect} from "react-router";

// TODO: Move to own files
const AllTransactions = () => <div />;

type State = {
    isAuthenticated: boolean,
    token: ?string,
    user: ?User,
};

class App extends React.Component<{}, State> {
    constructor (props: any) {
        super (props);
        const token = sessionStorage.getItem ('token');
        const user = sessionStorage.getItem ('user');
        if (token && user) {
            this.state = {
                isAuthenticated: true,
                token,
                user: JSON.parse (user),
            };
        } else {
            this.state = {
                isAuthenticated: false,
                token: undefined,
                user: undefined,
            };
        }
        this.state = {
            collapsed: true
        };
    }

    authenticate = (
        login: string,
        password: string,
        cb:  (error: ?Error) => void
    ) => {
        api
            .login (login, password)
            .then (({token, owner}) => {
                this.setState ({isAuthenticated: true, token, user: owner});
                sessionStorage.setItem ('token', token);
                sessionStorage.setItem ('user', JSON.stringify (owner));
                cb (null);
            })
            .catch (error => cb (error));
    };

    signout = (callback:  () => void) => {
        this.setState ({
            isAuthenticated: false,
            token: undefined,
            user: undefined,
        });
        sessionStorage.removeItem ('token');
        sessionStorage.removeItem ('user');
        callback ();
    };

    toggleNavbar= () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

    render () {
        const {isAuthenticated, user, token, collapsed} = this.state;

        const MenuBar = withRouter (({history, location: {pathname}}) => {
            if (isAuthenticated && user) {
                return (
                    <div>
                        <Navbar color="faded" light expand="md">
                            <NavbarBrand>WED3 Testat</NavbarBrand>
                            <NavbarToggler onClick={this.toggleNavbar} />
                            <Collapse isOpen={!collapsed} navbar>
                            <Nav>
                                <NavItem>
                                    <NavLink to="/dashboard">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/transactions">Account Transactions</NavLink>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Button color="primary" href="/logout" onClick={event => {
                                        event.preventDefault ();
                                        this.signout (() => history.push ('/'));
                                    }}>Logout {user.firstname} {user.lastname}</Button>
                                </NavItem>
                            </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
                );
            } else {
               return (
                   <div>
                       <Navbar color="faded" light expand="md">
                           <NavbarBrand>WED3 Testat</NavbarBrand>
                           <NavbarToggler onClick={this.toggleNavbar} />
                           <Collapse isOpen={!collapsed} navbar>
                           <Nav>
                               <NavItem>
                                   <NavLink to="/welcome/">Home</NavLink>
                               </NavItem>
                           </Nav>
                           <Nav className="ml-auto" navbar>
                               <NavItem>
                                   <Button color="primary" href="/signup">Registrieren</Button>
                               </NavItem>
                           </Nav>
                           </Collapse>
                       </Navbar>
                   </div>
               );
            }
        });

        return (
            <Router>
                <div>
                    <MenuBar />
                    <Route
                        exact
                        path="/"
                        render={() => (
                        isAuthenticated ? ( <Redirect to="/dashboard"/> ) : ( <Redirect to="/welcome"/> )
                    )}/>
                    <Route
                        path="/welcome"
                        render={props => (
                            <Login {...props} authenticate={this.authenticate} />
                        )}
                    />
                    <Route
                        path="/signup"
                        render={props => (
                            <Signup {...props} authenticate={this.authenticate} />
                        )}
                    />
                    {/*
            The following are protected routes that are only available for logged-in users. We also pass the user and token so 
            these components can do API calls. PrivateRoute is not part of react-router but our own implementation.
          */}
                    <PrivateRoute
                        path="/dashboard"
                        isAuthenticated={isAuthenticated}
                        token={token}
                        component={Dashboard}
                    />
                    <PrivateRoute
                        path="/transactions"
                        isAuthenticated={isAuthenticated}
                        token={token}
                        user={user}
                        component={AllTransactions}
                    />
                </div>
            </Router>
        );
    }
}

export default App;
