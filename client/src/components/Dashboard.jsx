import { Button, Card, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useState, useContext } from 'react';
import img from '../static/images/00017-3825825219.png';
import LoginModal from './LoginModal';
import NewUserModal from './NewUserModal';

const Dashboard = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  return (
    <>
      <NewUserModal show={showSignUp} setShow={setShowSignUp} />
      <LoginModal show={show} setShow={setShow} />
      <Container fluid className="no-padding fill">
        <Row>
          <h1 className="text-center top">Welcome to Chicken Tinder</h1>
        </Row>
        <Row className="bottom">
          <Col xs={6} className="no-padding left">
            <img className="img-fluid" src={img} />
          </Col>
          <Col className="no-padding right">
            <h3 className="dash" style={{ color: '#c56b31' }}>
              You and your significant other can't decide what to eat?
            </h3>
            <h4 className="dash">
              Sync Your Cravings, Sync Your Hearts - Find Your Ideal Dining
              Destination!
            </h4>
            {state.session ? (
              <Button
                className="dash hook"
                onClick={() => navigate('/requests/new')}
              >
                Start Synchronizing
              </Button>
            ) : (
              <Button className="dash hook" onClick={() => setShowSignUp(true)}>
                Start Synchronizing
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
