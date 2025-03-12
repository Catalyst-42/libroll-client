import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import api from '../../api/api';
import { login } from '../../slices/authSlice';

const Login = ({ show, handleClose, onLogin = () => {} }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      dispatch(login(token));
      onLogin();
      
      // Clear field
      setUsername('');
      setPassword('');

      handleClose();
    } catch (error) {
      console.log(error);
      setError('Неверные учетные данные');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Авторизация</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="username" className='mb-3'>
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className='mb-3'>
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">
            Войти
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
