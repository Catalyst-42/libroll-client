import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalCount, setTotalCount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/books', { title, author, total_count: totalCount });
      alert('Книга успешно добавлена!');
      setTitle('');
      setAuthor('');
      setTotalCount('');
    } catch (error) {
      console.error('Ошибка при добавлении книги:', error);
    }
  };

  return (
    <Container>
      <h2>Добавить новую книгу</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Название</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="author">
          <Form.Label>Автор</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="totalCount">
          <Form.Label>Количество</Form.Label>
          <Form.Control
            type="number"
            value={totalCount}
            onChange={(e) => setTotalCount(e.target.value)}
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

export default AddBook;
