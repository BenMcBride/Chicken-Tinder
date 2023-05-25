// imported from https://react-bootstrap.github.io/components/navbar/
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { io } from 'server/server';
import LoginModal from './LoginModal';
import NewUserModal from './NewUserModal';

function Header() {
  const { dispatch, state } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogout = () => {
    dispatch({
      type: 'LOGOUT',
    });
    navigate('/');
  };

  useEffect(() => {
    const socket = io('http://localhost:8000');
    socket.on('message', (message) => {
      console.log('Received message:', message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <NewUserModal show={showSignUp} setShow={setShowSignUp} />
      <LoginModal show={show} setShow={setShow} />
      <Navbar className="p-2" bg="dark" variant="dark" expand="lg">
        <Container>
          <Link className="navbar-brand accent" to="/">
            Chicken Tinder
          </Link>
          <Navbar.Toggle aria-controls="header" />
          <Navbar.Collapse id="header">
            <Nav as="ul" className="me-auto">
              {state.session ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/requests/new">
                    Sync Request!
                  </Link>
                </li>
              ) : (
                <li>
                  <Link className="nav-link" to="/dashboard">
                    Home
                  </Link>
                </li>
              )}
            </Nav>
            {state.session ? (
              <div className="d-flex gap-2">
                <Button
                  className="btn ms-auto"
                  onClick={() => navigate('/users/requests/received')}
                >
                  Requests
                </Button>
                <Button className="btn ms-auto" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  className="btn ms-auto"
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </Button>
                <Button className="btn ms-auto" onClick={() => setShow(true)}>
                  Login
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
