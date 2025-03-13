import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table, Stack, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { Pencil, Archive, Search, CheckLg, CalendarPlus, CalendarCheck, Person, Book, QuestionLg } from 'react-bootstrap-icons';

import api from '../../api/api';
import AddBorrow from '../Forms/AddBorrow';

const BorrowsList = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [borrowToEdit, setBorrowToEdit] = useState(null);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  // Fetch all
  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const borrowedResponse = await api.get('/borrows');
      setBorrowedBooks(borrowedResponse.data);

      const booksResponse = await api.get('/books');
      setBooks(booksResponse.data);

      const usersResponse = await api.get('/users');
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const handleReturnBook = async (id) => {
    try {
      await api.put(`/borrows/${id}/return`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update list
      const updatedBooks = borrowedBooks.map(
        (book) => book.id === id ? { ...book, status: 'returned' } : book
      );

      setBorrowedBooks(updatedBooks);
    } catch (error) {
      console.error('Ошибка при возврате книги:', error);
    }
  };

  const handleEdit = (borrow) => {
    setBorrowToEdit(borrow);
    setShowModal(true);
  };

  const handleAdd = () => {
    setBorrowToEdit(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const getBookTitle = (bookId) => {
    const book = books.find((book) => book.id === bookId);
    return book ? book.title : '?';
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : '?';
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('DD.MM.YYYY');
  };

  const filteredBooks = borrowedBooks.filter((book) => {
    const bookTitle = getBookTitle(book.book_id).toLowerCase();
    const userName = getUserName(book.user_id).toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (bookTitle.includes(searchTermLower) || userName.includes(searchTermLower)) &&
      (filterStatus ? book.status === filterStatus : true)
    );
  });

  return (
    <>
      { /* Filters */}
      <Row className='mb-4'>

        {/* Book or user name */}
        <Form.Group as={Col} sm={12} md={5} controlId="search" className='mt-4'>
          <InputGroup>
            <InputGroup.Text>
              <Search></Search>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Книга или заёмщик"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        {/* Status */}
        <Form.Group as={Col} sm={12} md={5} controlId="filterStatus" className='mt-4'>
          <InputGroup>
            <InputGroup.Text>
              <Search></Search>
            </InputGroup.Text>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Любой статус</option>
              <option value="active">Активные</option>
              <option value="returned">Возвращенные</option>
              <option value="lost">Потерянные</option>
            </Form.Select>
          </InputGroup>
        </Form.Group>

        {isAuthenticated &&
          <Col sm={12} md={2} className="d-flex align-items-end mt-4">
            <Button className="w-100" onClick={handleAdd}>Новый займ</Button>
          </Col>
        }
      </Row>

      <hr />

      {/* Taken books list */}
      <Row className='my-4'>
        {filteredBooks.map((book) => (
          <Col key={book.id} sm={12} md={6} lg={6} className='mb-4'>
            <Card>
              <Card.Body className='pt-2'>
                <Stack direction='horizontal' gap={2}>
                  <Card.Text className='mb-0 py-1'>
                    {getBookTitle(book.book_id)}
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
                      {book.status === 'active' ? (
                        <Button
                          variant="link"
                          size="sm"
                          className='text-warning'
                          onClick={() => handleReturnBook(book.id)}
                        >
                          <Archive style={{ marginBottom: '3px' }}/>
                        </Button>
                      ) : book.status === 'lost' ? (
                        <Button
                          variant='link'
                          size='sm'
                          className='text-danger'
                        >
                          <QuestionLg style={{ marginBottom: '3px' }}/>
                        </Button>
                      ) : (
                        <Button
                          variant='link'
                          size='sm'
                          className='text-success'
                        >
                          <CheckLg style={{ marginBottom: '3px' }}/>
                        </Button>
                      )}
                    </Card.Text>
                  }
                </Stack>

                <hr className='mt-1' />

                <Row>
                  <Col xs={1}>
                    <Book style={{ marginBottom: '3px' }} />
                  </Col>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '100px' }}>
                    Книга:
                  </Col>
                  <Col>
                    {getBookTitle(book.book_id)}
                  </Col>
                </Row>
                <Row>
                  <Col xs={1}>
                    <Person style={{ marginBottom: '3px' }} />
                  </Col>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '100px' }}>
                    Заёмщик:
                  </Col>
                  <Col>
                    {getUserName(book.user_id)}
                  </Col>
                </Row>
                <Row>
                  <Col xs={1}>
                    <CalendarPlus style={{ marginBottom: '3px' }} />
                  </Col>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '100px' }}>
                    Заём:
                  </Col>
                  <Col>
                    {formatDate(book.borrow_date)}
                  </Col>
                </Row>
                <Row>
                  <Col xs={1}>
                    <CalendarCheck style={{ marginBottom: '3px' }} />
                  </Col>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '100px' }}>
                    Возврат:
                  </Col>
                  <Col>
                    {book.return_date ? formatDate(book.return_date) : 'Не возвращена'}
                  </Col>
                </Row>
                <Row>
                  <Col xs={1}>
                    <Archive style={{ marginBottom: '3px' }} />
                  </Col>
                  <Col xs="auto" className="text-secondary" style={{ minWidth: '100px' }}>
                    Статус:
                  </Col>
                  <Col>
                    {book.status === 'active' ? 'Активный' : book.status === 'lost' ? 'Потерян' : 'Возвращён'}
                  </Col>
                </Row>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <AddBorrow show={showModal} handleClose={handleClose} borrowToEdit={borrowToEdit} refreshBorrows={fetchData} />
    </>
  );
};

export default BorrowsList;