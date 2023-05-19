import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestSyncForm = (props) => {
  const [requestsync, setRequestSync] = useState({
    email: '',
    searchLocation: '',
    searchDistance: '',
  });
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const {session} = useContext(AuthContext)
  if (!session) {
    navigate('/')
  }

  const changeHandler = (e) => {
    setRequestSync({
      ...requestsync,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/requestsyncs', requestsync)
      .then((res) => {
        console.log(res);
        setRequestSync({
          email: '',
          searchLocation: '',
          searchDistance: '',
        });
        setErrors(null)
        props.setLoaded(false);
      })
      .catch((err) => {
        console.log(err);
        setErrors(err?.response?.data?.errors);
      });
  };

  return (
    <Card className="mb-3" style={{width: '30rem', margin: '0 auto'}}>
      <Card.Header>
        <h1 className='text-center'>Send Dine-Sync Request!</h1>
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
              className={`${errors?.email ? 'is-invalid' :''}`}
            />
            {errors?.email && <Form.Text className='text-danger'>{errors.email.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="searchLocation">Address to search from:</Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={requestsync.searchLocation}
              name="searchLocation"
              id="searchLocation"
              className={`${errors?.searchLocation ? 'is-invalid' :''}`}
            />
            {errors?.searchLocation && <Form.Text className='text-danger'>{errors.searchLocation.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="searchDistance">Search Distance (in miles):</Form.Label>
            <Form.Control
              type="number"
              onChange={changeHandler}
              value={requestsync.searchDistance}
              name="searchDistance"
              id="searchDistance"
              className={`${errors?.searchDistance ? 'is-invalid' :''}`}
            />
            {errors?.searchDistance && <Form.Text className='text-danger'>{errors.searchDistance.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="text-center">
            <Button type="submit">Add RequestSync</Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default RequestSyncForm;
