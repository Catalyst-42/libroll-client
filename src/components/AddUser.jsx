import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import api from '../api/api';

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { first_name: firstName, last_name: lastName });
      alert('Пользователь успешно добавлен!');
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
    }
  };

  return (
    <Container>
      <h2>Добавить нового пользователя</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="firstName">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Добавить
        </Button>
      </Form>
    </Container>
  );
};

export default AddUser;
