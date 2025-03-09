import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import api from '../../api/api';

const AddUser = ({ show, handleClose, userToEdit, refreshUsers }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (userToEdit) {
      setFirstName(userToEdit.first_name);
      setLastName(userToEdit.last_name);
    } else {
      setFirstName('');
      setLastName('');
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userToEdit) {
        await api.put(`/users/${userToEdit.id}`, { first_name: firstName, last_name: lastName }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      } else {
        await api.post('/users', { first_name: firstName, last_name: lastName }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      }
      handleClose();
      refreshUsers();
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${userToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      handleClose();
      refreshUsers();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{userToEdit ? 'Редактировать пользователя' : 'Добавить нового пользователя'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            {userToEdit ? 'Обновить' : 'Добавить'}
          </Button>
          {userToEdit && (
            <Button variant="danger" onClick={handleDelete} className="ms-2">
              Удалить
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUser;
