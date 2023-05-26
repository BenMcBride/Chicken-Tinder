import { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import socket from '../static/socket-client';

const RequestSyncForm = (props) => {
  const [requestsync, setRequestSync] = useState({
    senderEmail: '',
    email: '',
    searchLocation: '',
    searchDistance: '',
  });
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setRequestSync({
      ...requestsync,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const seshData = JSON.parse(localStorage.getItem('session'));
    const senderEmail = seshData.user.email;
    requestsync.senderEmail = senderEmail;
    axios
      .post('http://localhost:8000/api/requests/request', requestsync)
      .then((res) => {
        socket.emit('messageSent', requestsync.email);
        setRequestSync({
          senderEmail: '',
          email: '',
          searchLocation: '',
          searchDistance: '',
        });
        const requestId = res.data.requestId;
        setErrors(null);
        navigate(`/requests/pending/${requestId}`);
      })
      .catch((err) => {
        console.log(err);
        setErrors(err?.response?.data?.errors);
      });
  };

  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('session');
      if (!sessionData) {
        navigate('/');
      }
    };
    checkSession();
  }, []);

  return (
    <Card className="mb-3" style={{ width: '30rem', margin: '0 auto' }}>
      <Card.Header>
        <h1 className="text-center">Send a Sync Request!</h1>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Their Email:</Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={requestsync.email}
              name="email"
              id="email"
              className={`${errors?.email ? 'is-invalid' : ''}`}
            />
            {errors?.email && (
              <Form.Text className="text-danger">
                {errors.email.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="searchLocation">
              Address to search from:
            </Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={requestsync.searchLocation}
              name="searchLocation"
              id="searchLocation"
              className={`${errors?.searchLocation ? 'is-invalid' : ''}`}
            />
            {errors?.searchLocation && (
              <Form.Text className="text-danger">
                {errors.searchLocation.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="searchDistance">
              Search Distance (in km):
            </Form.Label>
            <Form.Control
              type="number"
              onChange={changeHandler}
              value={requestsync.searchDistance}
              name="searchDistance"
              id="searchDistance"
              className={`${errors?.searchDistance ? 'is-invalid' : ''}`}
            />
            {errors?.searchDistance && (
              <Form.Text className="text-danger">
                {errors.searchDistance.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="text-center">
            <Button type="submit">Send Request</Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RequestSyncForm;
