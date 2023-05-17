import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewUserForm = (props) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/api/users', user)
      .then((res) => {
        console.log(res);
        setUser({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setErrors(null)
        props.setLoaded(false);
        navigate('/request/new');
      })
      .catch((err) => {
        console.log(err);
        setErrors(err?.response?.data?.errors);
      });
  };

  return (
    <Card className="mb-3" style={{width: '30rem'}}>
      <Card.Header>
        <h1>Add User</h1>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Name:</Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={user.name}
              name="name"
              id="name"
              className={`${errors?.name ? 'is-invalid' :''}`}
            />
            {errors?.name && <Form.Text className='text-danger'>{errors.name.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email:</Form.Label>
            <Form.Control
              type="text"
              onChange={changeHandler}
              value={user.email}
              name="email"
              id="email"
              className={`${errors?.email ? 'is-invalid' :''}`}
            />
            {errors?.email && <Form.Text className='text-danger'>{errors.email.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password:</Form.Label>
            <Form.Control
              type="password"
              onChange={changeHandler}
              value={user.password}
              name="password"
              id="password"
              className={`${errors?.password ? 'is-invalid' :''}`}
            />
            {errors?.password && <Form.Text className='text-danger'>{errors.password.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="confirmPassword">Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              onChange={changeHandler}
              value={user.confirmPassword}
              name="confirmPassword"
              id="confirmPassword"
              className={`${errors?.confirmPassword ? 'is-invalid' :''}`}
            />
            {errors?.confirmPassword && <Form.Text className='text-danger'>{errors.confirmPassword.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="text-center">
            <Button type="submit">Add User</Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};
export default NewUserForm;