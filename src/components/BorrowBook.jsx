import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import api from '../api/api';

const BorrowBook = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [borrowDate, setBorrowDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

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

  // Set today date
  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setBorrowDate(today);
  };

  // Set return in next week
  const setReturnDateInAWeek = () => {
    const today = new Date();
    const next_week = new Date(
      today.setDate(today.getDate() + 7)
    ).toISOString().split('T')[0];

    setReturnDate(next_week);
  };

  // Set return in next month
  const setReturnDateInAMonth = () => {
    const today = new Date();
    const next_month = new Date(
      today.setMonth(today.getMonth() + 1)
    ).toISOString().split('T')[0];

    setReturnDate(next_month);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/borrowed-books', {
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
    } catch (error) {
      console.error('Ошибка при взятии книги:', error);
    }
  };

  return (
    <Card className='my-4'>
      <Card.Header>
        Взять книгу
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

          {/* Borrow create and return dates */}
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
              <InputGroup>
                <Form.Control
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
                <Button variant="secondary" onClick={setReturnDateInAWeek}>
                  Неделя
                </Button>
                <Button variant="secondary" onClick={setReturnDateInAMonth}>
                  Месяц
                </Button>
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

export default BorrowBook;
