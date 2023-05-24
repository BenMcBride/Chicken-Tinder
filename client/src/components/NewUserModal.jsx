import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function NewUserModal({ show, setShow }) {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
        'http://localhost:8000/api/users',
        user
      );
      dispatch({
        type: 'LOGIN',
        payload: {
          token: response.data.token,
          user: {
            email: user.email,
          },
        },
      });
      setUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      handleClose();
      navigate('/requests/new');
    } catch (error) {
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
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="firstName">First Name:</Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={user.firstName}
              name="firstName"
              id="firstName"
              className={`${errors?.firstName ? 'is-invalid' : ''}`}
            />
            {errors?.firstName && (
              <Form.Text className="text-danger">
                {errors.firstName.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Last Name:</Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={user.lastName}
              name="lastName"
              id="lastName"
              className={`${errors?.lastName ? 'is-invalid' : ''}`}
            />
            {errors?.lastName && (
              <Form.Text className="text-danger">
                {errors.lastName.message}
              </Form.Text>
            )}
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label htmlFor="confirmPassword">Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              onChange={changeHandler}
              value={user.confirmPassword}
              name="confirmPassword"
              id="confirmPassword"
              className={`${errors?.confirmPassword ? 'is-invalid' : ''}`}
            />
            {errors?.confirmPassword && (
              <Form.Text className="text-danger">
                {errors.confirmPassword.message}
              </Form.Text>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Form.Group className="text-center">
            <Button type="submit">Add User</Button>
          </Form.Group>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default NewUserModal;
