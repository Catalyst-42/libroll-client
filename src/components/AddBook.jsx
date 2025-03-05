import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import api from '../api/api';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalCount, setTotalCount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', { title, author, total_count: totalCount });
      alert('Книга успешно добавлена!');
      setTitle('');
      setAuthor('');
      setTotalCount('');
    } catch (error) {
      console.error('Ошибка при добавлении книги:', error);
    }
  };

  return (
    <Container className='my-4'>
      <Card>
        <Card.Header>Добавить новую книгу</Card.Header>
        <Card.Body>
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
                required
              />
            </Form.Group>
            <Button type="submit">
              Добавить
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddBook;
