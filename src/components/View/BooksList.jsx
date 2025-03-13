import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { Pencil, Search, Person, List, Quote } from 'react-bootstrap-icons';

import api from '../../api/api';
import AddBook from '../Forms/AddBook';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке списка книг:', error);
    }
  };

  const filteredBooks = books.filter((book) => {
    return book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEdit = (book) => {
    setBookToEdit(book);
    setShowModal(true);
  };

  const handleAdd = () => {
    setBookToEdit(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Filters */}
      <Row className='my-4'>
        <Form.Group as={Col}>
          <InputGroup>
            <InputGroup.Text>
              <Search></Search>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Название или автор"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        {isAuthenticated &&
          <Col xs="auto" className="d-flex align-items-end">
            <Button onClick={handleAdd}>Новая книга</Button>
          </Col>
        }
      </Row>

      <hr />

      <Row className='my-4'>
        {filteredBooks.map((book) => (
          <Col key={book.id} sm={12} lg={6} className='mb-4'>
            <Card>
              <Card.Body className='pt-2'>
                <Stack direction='horizontal' gap={2}>
                  <Card.Text className='mb-0 py-1'>
                    {book.title}
                  </Card.Text>

                  <Card.Text className='mb-0 text-secondary'>
                    #{book.id}
                  </Card.Text>

                  {isAuthenticated &&
                    <Card.Text className='ms-auto'>
                      <Button
                        variant="link"
                        size="sm"
                        className='text-warning'
                        onClick={() => handleEdit(book)}
                      >
                        <Pencil style={{ marginBottom: '3px' }}/>
                      </Button>
                    </Card.Text>
                  }
                </Stack>

                <hr className='mt-1' />

                <Row>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '120px' }}>
                    <Quote style={{ marginBottom: '3px' }}/> Название:
                  </Col>
                  <Col>
                    {book.title}
                  </Col>
                </Row>
                <Row>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '120px' }}>
                    <Person style={{ marginBottom: '3px' }}/> Автор:
                  </Col>
                  <Col>
                    {book.author}
                  </Col>
                </Row>
                <Row>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '120px' }}>
                    <List style={{ marginBottom: '3px' }}/> Книг:
                  </Col>
                  <Col className='text-left'>
                    {book.total_count}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <AddBook show={showModal} handleClose={handleClose} bookToEdit={bookToEdit} refreshBooks={fetchBooks} />
    </>
  );
};

export default BooksList;
