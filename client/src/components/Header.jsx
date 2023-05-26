import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginModal from './LoginModal';
import NewUserModal from './NewUserModal';
import socket from '../static/socket-client';

function Header() {
  const { dispatch, state } = useContext(AuthContext);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const location = useLocation();

  const handleLogout = () => {
    dispatch({
      type: 'LOGOUT',
    });
    navigate('/');
  };

  const fetchPendingRequestsCount = async () => {
    try {
      const seshData = await JSON.parse(localStorage.getItem('session'));
      const id = seshData.user.id;
      const response = await fetch(
        `http://localhost:8000/api/requests/received?recipient=${id}`
      );
      const data = await response.json();
      let count = 0;
      for (const request of data.requests) {
        if (request.status === 'Pending') {
          count++;
        }
      }
      setPendingRequestsCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleMessageReceived = () => {
      fetchPendingRequestsCount();
    };
    if (state.session) {
      socket.on('messageReceived', handleMessageReceived);
    }
    return () => {
      socket.off('messageReceived', handleMessageReceived);
    };
  }, [state.session]);

  useEffect(() => {
    fetchPendingRequestsCount();
  }, [location.pathname]);

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
                <>
                  <li>
                    <Link className="nav-link" to="/dashboard">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/requests/new">
                      Send Request!
                    </Link>
                  </li>
                </>
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
                  onClick={() => {
                    if (location.pathname === '/users/requests/received') {
                      window.location.reload();
                    } else {
                      navigate('/users/requests/received');
                    }
                  }}
                >
                  Inbox{' '}
                  {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
                </Button>
                <Button
                  className="btn ms-auto"
                  onClick={() => {
                    navigate('/users/requests/sent');
                  }}
                >
                  Sent
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
