import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import api from '../../api/api';

const AddBook = ({ show, handleClose, bookToEdit, refreshBooks }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalCount, setTotalCount] = useState('');
  const [error, setError] = useState('');
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setTotalCount(bookToEdit.total_count);
    } else {
      setTitle('');
      setAuthor('');
      setTotalCount('');
    }
  }, [bookToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalCount <= 0) {
      setError('Количество должно быть положительным числом');
      return;
    }

    try {
      if (bookToEdit) {
        await api.put(`/books/${bookToEdit.id}`, { title, author, total_count: totalCount }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await api.post('/books', { title, author, total_count: totalCount }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTitle('');
        setAuthor('');
        setTotalCount('');
      }
      handleClose();
      refreshBooks();
    } catch (error) {
      console.error('Ошибка при сохранении книги:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/books/${bookToEdit.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      handleClose();
      refreshBooks();
    } catch (error) {
      console.error('Ошибка при удалении книги:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{bookToEdit ? 'Редактировать книгу' : 'Добавить новую книгу'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title" className='mb-3'>
            <Form.Label>Название</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="author" className='mb-3'>
            <Form.Label>Автор</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="totalCount" className='mb-3'>
            <Form.Label>Количество</Form.Label>
            <Form.Control
              type="number"
              value={totalCount}
              onChange={(e) => setTotalCount(e.target.value)}
              isInvalid={!!error}
              required
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit">
            {bookToEdit ? 'Обновить' : 'Добавить'}
          </Button>
          {bookToEdit && (
            <Button variant="danger" onClick={handleDelete} className="ms-2">
              Удалить
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBook;
