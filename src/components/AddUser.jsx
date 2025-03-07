import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import api from '../api/api';

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { first_name: firstName, last_name: lastName }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Пользователь успешно добавлен!');
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
    }
  };

  return (
    <Card className='my-4'>
      <Card.Header>
        Добавить нового пользователя
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstName" className='mb-3'>
            <Form.Label>Имя</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="lastName" className='mb-3'>
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
      </Card.Body>
    </Card>
  );
};

export default AddUser;
