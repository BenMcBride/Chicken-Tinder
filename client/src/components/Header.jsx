// imported from https://react-bootstrap.github.io/components/navbar/
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { session } = useContext(AuthContext);
  return (
    <Navbar className="p-2" bg="dark" variant="dark" expand="lg">
      <Container>
        <Link className="navbar-brand" to="/">
          Chicken Tinder
        </Link>
        <Navbar.Toggle aria-controls="header" />
        <Navbar.Collapse id="header">
          <Nav as="ul" className="me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/request/new">
                Home
              </Link>
            </li>
          </Nav>
          {session && (
            <Button className="btn ms-auto" to="/">
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
