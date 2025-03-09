import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';

import api from '../../api/api';

const AddBorrow = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await api.get('/books');
        const usersResponse = await api.get('/users');

        setBooks(booksResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  // Time buttons logic
  const setTodayDate = () => {
    const today = moment().format('YYYY-MM-DD');
    setBorrowDate(today);
  };

  const setReturnDateInA2Week = () => {
    const next_week = moment().add(14, 'days').format('YYYY-MM-DD');
    setReturnDate(next_week);
  };

  const setReturnDateInAMonth = () => {
    const next_month = moment().add(1, 'month').format('YYYY-MM-DD');
    setReturnDate(next_month);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (moment(returnDate).isBefore(moment(borrowDate))) {
      setError('Дата возврата должна быть позже даты заёма книги.');
      return;
    }
    try {
      await api.post('/borrows', {
        book_id: bookId,
        user_id: userId,
        borrow_date: borrowDate,
        return_date: returnDate,
      });
      alert('Книга успешно взята!');

      setBookId('');
      setUserId('');
      setBorrowDate('');
      setReturnDate('');
      setError('');
    } catch (error) {
      console.error('Ошибка при взятии книги:', error);
    }
  };

  return (
    <Card className='my-4'>
      <Card.Header>
        Добавить новый займ
      </Card.Header>
      <Card.Body>

        {/* Book */}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="bookId" className='mb-3'>
            <Form.Label>Книга</Form.Label>
            <Form.Control
              as="select"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            >
              <option value="">Выберите книгу</option>
              {books
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.author})
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          {/* User */}
          <Form.Group controlId="userId">
            <Form.Label>Пользователь</Form.Label>
            <Form.Control
              as="select"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Выберите пользователя</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Borrow take and return dates */}
          <Row>
            <Form.Group as={Col} controlId="borrowDate" className='mt-3' style={{ minWidth: '30ch' }}>
              <Form.Label>Дата взятия</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  value={borrowDate}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  required
                />
                <Button variant="secondary" onClick={setTodayDate}>
                  Сегодня
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col} controlId="returnDate" className='mt-3' style={{ minWidth: '30ch' }}>
              <Form.Label>Дата возврата</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  isInvalid={!!error}
                />
                <Button variant="secondary" onClick={setReturnDateInA2Week}>
                  2 Недели
                </Button>
                <Button variant="secondary" onClick={setReturnDateInAMonth}>
                  Месяц
                </Button>
                <Form.Control.Feedback type="invalid">
                  {error}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit" className='mt-3'>
            Взять книгу
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddBorrow;
