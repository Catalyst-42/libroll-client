import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { Pencil, Search } from 'react-bootstrap-icons';

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
            <Button onClick={handleAdd}>Добавить книгу</Button>
          </Col>
        }
      </Row>

      <hr />

      <Card className='my-4'>
        <Card.Header>
          Список всех книг
        </Card.Header>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Автор</th>
                <th>Экземпляров</th>
                {isAuthenticated && <th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.total_count}</td>
                  {isAuthenticated && (
                    <td>
                      <Button variant="link" onClick={() => handleEdit(book)}>
                        <Pencil></Pencil>
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <AddBook show={showModal} handleClose={handleClose} bookToEdit={bookToEdit} refreshBooks={fetchBooks} />
    </>
  );
};

export default BooksList;
