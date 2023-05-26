import {
  Button,
  // Card,
  Row, Col, Container
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useState, useContext } from 'react';
// import img from '../assets/images/splashchxcover2.jpg';
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
        <Row className='pt-5'>
          <h1 className="text-end top pt-5">Can't Decide Where to Eat?</h1>
        </Row>
        <Row className="bottom">
          <Col xs={6} className="no-padding left">
          </Col>
          <Col className="no-padding right">
            <h3 className="dash subheading accent">
              Sync Your Cravings, Sync Your Hearts - Find Your Ideal Dining
              Destination!
            </h3>
            {state.session ? (
              <Button
                className="dash hook uppercase"
                onClick={() => navigate('/requests/new')}
              >
                Start Synchronizing
              </Button>
            ) : (
              <Button className="dash hook uppercase " onClick={() => setShowSignUp(true)}>
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
