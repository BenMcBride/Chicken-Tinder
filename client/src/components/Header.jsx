// imported from https://react-bootstrap.github.io/components/navbar/
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Navbar className='p-2' bg="dark" variant='dark' expand="lg">
      <Container>
        <Link className='navbar-brand' to='/'>Chicken Tinder</Link>
        <Navbar.Toggle aria-controls="header" />
        <Navbar.Collapse id="header">
          <Nav as='ul' className="me-auto">
            <li className="nav-item">
              <Link className='nav-link' to='/request/new'>Home</Link>
            </li>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;