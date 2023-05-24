import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function LoginModal({ show, setShow }) {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const changeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/login',
        user
      );
      console.log(response);
      dispatch({
        type: 'LOGIN',
        payload: {
          token: response.data.token,
          user: {
            id: response.data.user._id,
            email: response.data.user.email,
          },
        },
      });
      setUser({
        email: '',
        password: '',
      });
      handleClose();
      navigate('/requests/new');
    } catch (error) {
      console.log(error);
      if (error.response) {
        setErrors(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email:</Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={user.email}
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
            <Form.Label htmlFor="password">Password:</Form.Label>
            <Form.Control
              type="password"
              onChange={changeHandler}
              value={user.password}
              name="password"
              id="password"
              className={`${errors?.password ? 'is-invalid' : ''}`}
            />
            {errors?.password && (
              <Form.Text className="text-danger">
                {errors.password.message}
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Form.Group className="text-center">
            <Button type="submit">Login</Button>
          </Form.Group>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default LoginModal;
