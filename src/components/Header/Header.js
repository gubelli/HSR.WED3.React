// @flow

import React from 'react';
import {Navbar, NavbarBrand, Nav, NavItem, NavLink, Button} from 'reactstrap';
import './Header.css';

class Header extends React.Component<{}, *> {
  render () {
    return (
      <div>
        <Navbar dark expand="md">
          <NavbarBrand href="/welcome/">WED3 Testat</NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink href="/welcome/">Home</NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Button color="primary" href="/signup">Register</Button>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Header;
